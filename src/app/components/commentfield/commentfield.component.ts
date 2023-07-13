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
  array: any = [];

  editorStyle = {
    height: '100px',
  };

  ///////////// IMAGE UPLOAD /////////////
  imageSrc$: string[] = [];

  //selectedFile: File;
  async onFileSelected(event: any): Promise<void> {
    //this.selectedFile = event.target.files[0];
    for (let i = 0; i < this.array.length; i++) {
      this.imageSrc$.push(this.array[i]);
    }
    this.imageSrc$.push(
      await this.uploadImagesService.onFileSelected(event, this.currentUserId$)
    );
    for (let i = 0; i < this.imageSrc$.length; i++) {
      const img = this.imageSrc$[i];
      console.log(img);
    }
  }
  /////////// END IMAGE UPLOAD /////////////

  constructor(
    public channelService: ChannelService,
    public firestoreService: FirestoreService,
    public chatService: ChatService,
    public usersService: UsersService,
    public uploadImagesService: UploadImagesService,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) {

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
  }

  onSubmit() {
    this.editorContent = this.editorForm.get('editor').value;
    if (this.parentName == 'channel') {
      this.channelService.addNewMessage(this.editorContent);
    } else if (this.parentName == 'chat') {
      this.chatService.sendChatMessage(this.editorContent);
    } else if (this.parentName == 'thread') {
      this.firestoreService.updateSpecificThread(
        this.channelService.activeThread.threadId,
        this.editorContent,
        this.currentUserId$
      );
      this.channelService.updateThread();
    } else if (this.parentName == 'threadshortcut') {
      this.firestoreService.updateSpecificThread(
        this.threadId,
        this.editorContent,
        this.currentUserId$
      );
    }
    // Clear the editor content
    this.editorForm.get('editor').setValue(null);
  }

  maxLength(e) {
    if (e.editor.getLength() > 1000) {
      e.editor.deleteText(1000, e.editor.getLength());
    }
  }

  get currentUserId$() {
    return this.usersService.currentUserId$;
  }

  getEditorInstance(editorInstance: any) {
    this.quillEditorRef = editorInstance;
    const toolbar = editorInstance.getModule('toolbar');
    toolbar.addHandler('image', this.imageHandler.bind(this));
  }

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
          this.array.push(base64Images);
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

  deleteTemporaryImages(index: number): void {
    if (index >= 0 && index < this.array.length) {
      this.array.splice(index, 1);
    }
  }

  // addStyleToElement(i) {
  //   const element = this.elementRef.nativeElement.querySelector(i);
  //   this.renderer.setStyle(element, 'opacity', 'gray');
  // }
}
