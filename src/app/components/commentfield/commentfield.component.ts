import { Component, Input, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import 'quill-emoji/dist/quill-emoji.js';
import { ChannelService } from 'src/app/services/channel.service';
import { ChatService } from 'src/app/services/chat.service';
import { FirestoreService } from 'src/app/services/firestore.service';


@Component({
  selector: 'app-commentfield',
  templateUrl: './commentfield.component.html',
  styleUrls: ['./commentfield.component.scss']
})
export class CommentfieldComponent implements OnInit {
  @ViewChild("textEditor") textEditor: ElementRef;
  @Input() parentName: string;
  editorForm: FormGroup;
  editorContent: string;

  editorStyle ={
    height: '150px'
  }
  
  modules = {}

  constructor(public channelService: ChannelService, public firestoreService: FirestoreService, public chatService: ChatService) {
    this.modules = {
      'emoji-shortname': true,
      'emoji-textarea': false,
      'emoji-toolbar': true,
      'toolbar': {
        container: [
          ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
          ['blockquote', 'code-block'],

          // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered' }, { 'list': 'bullet' }],
          // [{ 'script': 'sub' }, { 'script': 'super' }],      // superscript/subscript
          // [{ 'indent': '-1' }, { 'indent': '+1' }],          // outdent/indent
          // [{ 'direction': 'rtl' }],                         // text direction

          // [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

          // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          // [{ 'font': [] }],
          // [{ 'align': [] }],

          // ['clean'],                                         // remove formatting button

          // ['link', 'image', 'video'],                         // link and image, video
          ['emoji'],
        ],
        handlers: { 'emoji': function () { } }
      }
    }
  }

  ngOnInit(): void {
    this.editorForm = new FormGroup({
      'editor': new FormControl(null)
    })
  }

  onSubmit() {
    this.editorContent = this.editorForm.get('editor').value;
    if (this.parentName == 'channel') {
        this.channelService.addNewMessage(this.editorContent);
    } else if (this.parentName == 'chat') {
        this.chatService.sendChatMessage(this.editorContent);
    } else if(this.parentName == 'thread') {
      this.firestoreService.updateSpecificThread(this.channelService.activeThread.threadId, this.editorContent, this.channelService.activeThread.user['id']);
      this.channelService.updateThread();
    }
    //this.textEditor.nativeElement.setContents([{ insert: '\n' }]);
  }

  maxLength(e) {
    if(e.editor.getLength() > 1000) {
      e.editor.deleteText(1000, e.editor.getLength());
    };
  } 
}
