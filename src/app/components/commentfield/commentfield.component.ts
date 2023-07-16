import { UsersService } from './../../services/users.service';
import { Component, Input, OnInit, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'quill-emoji/dist/quill-emoji.js';
import { ChannelService } from 'src/app/services/channel.service';
import { ChatService } from 'src/app/services/chat.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UploadImagesService } from 'src/app/services/upload-images.service';


@Component({
  selector: 'app-commentfield',
  templateUrl: './commentfield.component.html',
  styleUrls: ['./commentfield.component.scss'],
})
export class CommentfieldComponent implements OnInit {
  @ViewChild('textEditor') textEditor: ElementRef;
  @Input() parentName: string;
  @Input() threadId: string;
  editorForm: FormGroup;
  editorContent: any;
  quillEditorRef: any;
  quillModules: any;
  base64Array: any = [];
  base64Attachement: any[];
  uid: any;

  editorStyle = {
    height: '100px',
  };

  ///////////// IMAGE UPLOAD /////////////

  selectedFile: File;
  isUploading: boolean;

  /////////// END IMAGE UPLOAD /////////////

  constructor(
    public channelService: ChannelService,
    public firestoreService: FirestoreService,
    public chatService: ChatService,
    public usersService: UsersService,
    public uploadImagesService: UploadImagesService
  ) {
    this.base64Attachement = [];

    this.quillModules = {
      'emoji-shortname': true,
      'emoji-textarea': false,
      'emoji-toolbar': true,
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'], // toggled buttons
          ['blockquote', 'code-block'],

          // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ list: 'ordered' }, { list: 'bullet' }],
          // [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
          // [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
          // [{ 'direction': 'rtl' }],                         // text direction

          // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

          // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          // [{ 'font': [] }],
          // [{ 'align': [] }],

          // ['clean'],                                         // remove formatting button

          ['image'], // image

          //['link', 'video'],                                  // link and video

          ['emoji'],
        ],
        handlers: {
          emoji: function () { },
        },
      },
    };
  }

  ngOnInit(): void {
    this.editorForm = new FormGroup({
      editor: new FormControl(null),
    });
    this.getCurrentUserId();
  }

  /**
   * button to send messages
   */
  async onSubmit() {
    this.editorContent = this.editorForm.get('editor').value;
    if (this.base64Array.length > 0) {
      for (let i = 0; i < this.base64Array.length; i++) {
        const file = this.base64Array[i];
        await this.onFileSelected(file, i);
      }
      
      // // this.imageSrc$ contains the array of download URLs
      // console.log('Array of Download URLs: ',this.imageSrc$);
      
    }
    if (this.parentName == 'channel') {
      this.channelService.addNewMessage(this.editorContent);
    } else if (this.parentName == 'chat') {
      this.chatService.sendChatMessage(this.editorContent);
    } else if (this.parentName == 'thread') {
      this.firestoreService.updateSpecificThread(
        this.channelService.activeThread.threadId,
        this.editorContent,
        this.uid
      );
      this.channelService.updateThread();
    } else if (this.parentName == 'threadshortcut') {
      this.firestoreService.updateSpecificThread(
        this.threadId,
        this.editorContent,
        this.uid
      );
    }
    // Clear the editor content
    this.editorForm.get('editor').setValue(null);
  }

  async onFileSelected (file: any, index: number): Promise<void> {
    this.isUploading = true;
    const src = await this.uploadImagesService.onFileSelected(file, this.uid);
    this.base64Array[index].url = src;   
    this.isUploading = false;
  }

  /**
   * Determine maximum length in the text editor
   */
  maxLength(e) {
    if (e.editor.getLength() > 1000) {
      e.editor.deleteText(1000, e.editor.getLength());
    }
  }

  async getCurrentUserId() {
    this.uid = await this.usersService.currentUserId$;
  }

  /**
   * Gets a reference of the text editor
   */
  getEditorInstance(editorInstance: any) {
    this.quillEditorRef = editorInstance;
    const toolbar = editorInstance.getModule('toolbar');
    toolbar.addHandler('image', this.imageHandler.bind(this));
  }

  /**
   * Function to insert images via the image icon for the attachment
   */
  imageHandler = () => {
    const range = this.quillEditorRef.getSelection();
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.addEventListener('change', () => {
      const file = input.files[0];
      if (file) {
        // Insert temporary loading placeholder image
        //this.quillEditorRef.insertEmbed(range.index, 'image', 'assets/img/commentfield/loading.png');
        const reader = new FileReader();
        reader.onload = () => {
          const base64Images = reader.result.toString();
          const fileName = file.name; // Get the original file name
          this.base64Attachement.push(base64Images);
          const base64WithFileName = this.getBase64WithFileName(base64Images, fileName);
          const base64ArrayJson = {
            base64: base64Images,
            fileName: base64WithFileName
          };
          this.base64Array.push(base64ArrayJson);
          // console.log('ArrayJson', base64ArrayJson);
          console.log('Array', this.base64Array);
          
          // Update the temporary image with the actual image
          //this.quillEditorRef.deleteText(range.index, 1);
          this.quillEditorRef.insertEmbed(range.index, 'image', base64Images);
        };
        reader.readAsDataURL(file);
      }
    });
    input.click();
    const content = this.editorForm.get('editor').value;
  };

  /**
   * Function returns the original filename of a base64 image format
   */
  getBase64WithFileName(base64String: string, fileName: string): string {
    const matches = base64String.match(/^data:(.+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      const mimeType = matches[1];
      const base64Data = matches[2];
      return `${fileName}`;
    }
    return '';
  }

  /**
   * Function to delete a picture from the attachment
   */
  deleteTemporaryImages(index: number): void {
    if (index >= 0 && index < this.base64Attachement.length) {
      this.base64Attachement.splice(index, 1);
    }
    if (index >= 0 && index < this.base64Array.length) {
      this.base64Array.splice(index, 1);
      console.log('From Delete:', this.base64Array);
    }
  }
}
