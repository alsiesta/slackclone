import { UsersService } from './../../services/users.service';
import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  imageURLs: string[];

  editorStyle = {
    height: '100px',
  };

  selectedFile: File;
  isUploading: boolean;

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
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['image'], // image
          ['emoji'],
        ],
        handlers: {
          emoji: function () { },
        },
      },
      keyboard: {
        bindings: {
          enter: {
            key: 13, // Disable handling of Enter key
            handler: () => { },
          },
        }
      }
    };
  }

  ngOnInit(): void {
    this.editorForm = new FormGroup({
      editor: new FormControl(null),
    });
    this.getCurrentUserId();
  }

  /**
  * Function to remove the <img> tag from the editor content.
  */
  removeImgTagFromEditorContent(editorContent: string): string {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = editorContent;
    const imgElements = tempDiv.getElementsByTagName('img');
    for (let i = imgElements.length - 1; i >= 0; i--) {
      const imgElement = imgElements[i];
      imgElement.remove();
    }
    return tempDiv.innerHTML;
  }

  /**
   * button to send messages
   */
  async onSubmit() {
    this.editorContent = this.editorForm.get('editor').value;
    if (this.editorContent != null) {
      if (this.base64Attachement.length > 4) {
        alert('You have exceeded the maximum number of images. You can upload a maximum of four images.');
      } else {
        this.editorContent = this.removeImgTagFromEditorContent(this.editorContent);
        if (this.base64Array.length > 0) {
          for (let i = 0; i < this.base64Array.length; i++) {
            const file = this.base64Array[i];
            await this.onFileSelected(file, i);
          }
        }
        this.imageURLs = this.pushImgageUrlsToArray(this.base64Array);
        this.handleParentAction();
        this.clearTextEditor();
      }
    }
  }

  /**
  * push image urls to array
  * @param base64Array - array of base64 images
  * @returns - array of image urls
  */
  pushImgageUrlsToArray(base64Array: any) {
    let imageURLs: string[] = [];
    for (let i = 0; i < base64Array.length; i++) {
      imageURLs.push(base64Array[i].url);
    }
    return imageURLs;
  }


  /**
  * Add the thread to the corresponding component depending on the call of the text-editor.
  */
  handleParentAction() {
    if (this.parentName == 'channel') {
      this.channelService.addNewMessage(this.editorContent, this.imageURLs);
    } else if (this.parentName == 'chat') {
      this.chatService.sendChatMessage(this.editorContent, this.imageURLs);
    } else if (this.parentName == 'thread') {
      this.firestoreService.updateSpecificThread(
        this.channelService.activeThread.threadId,
        this.editorContent,
        this.uid,
        this.imageURLs
      );
      this.channelService.updateThread();
    } else if (this.parentName == 'threadshortcut') {
      this.firestoreService.updateSpecificThread(
        this.threadId,
        this.editorContent,
        this.uid,
        this.imageURLs
      );
    }
  }

  /**
* Empty the text editor after submitting the thread.
*/
  clearTextEditor() {
    this.editorForm.get('editor').setValue(null);
    this.base64Attachement = [];
    this.base64Array = [];
  }

  /**
   * Saves the images in the Firestore storage. 
   */
  async onFileSelected(file: any, index: number): Promise<void> {
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

  /**
   * Gets the Id of the current user
   */
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
        this.handleFileUpload(file, range);
      }
    });
    input.click();
  };

  /**
  * Deals with the upload images and prepares the images for the Firestore storage.
  */
  handleFileUpload(file: any, range: any) {
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
      this.quillEditorRef.insertEmbed(range.index, 'image', base64Images);
    };
    reader.readAsDataURL(file);
  }

  /**
   * Function returns the original filename of a base64 image format
   */
  getBase64WithFileName(base64String: string, fileName: string): string {
    const matches = base64String.match(/^data:(.+);base64,(.+)$/);
    if (matches && matches.length === 3) {
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
    }
  }

  onEnterKey(event: Event) {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter' && !keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault(); // Prevent new line from being added
      this.onSubmit(); // Submit the message
    }
  }
}
