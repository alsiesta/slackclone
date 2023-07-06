import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChannelService } from 'src/app/services/channel.service';
import { ChatService } from 'src/app/services/chat.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnDestroy, OnInit {
  observerChatList: Observable<any>;
  showEditor = true;
  scrollStatus = this.chatService.scrollStatus;

  constructor(
    public chatService: ChatService,
    public firestoreservice: FirestoreService,
    public channelService: ChannelService,
    public searchService: SearchService
  ) {
    this.observerChatList = this.firestoreservice.observeChat$;
    this.observerChatList.subscribe((chats) => {
      this.chatService.chatList = chats;
      this.chatService.updateChatContent();
    });
    this.scrollStatus.subscribe((status) => {
      if (status) {
        this.scrollToBottomOfContent('smooth');
      } else if (!status) {
        this.scrollToBottomOfContent('instant');
      }
    });
  }

  ngOnInit(): void {
    this.checkWindowHeight();
    this.eventListenerWindowHeight();
  }

  ngOnDestroy(): void {
    this.chatService.chatReady = false;
  }

  /**
   * scroll to the bottom of the chat-content
   * @param style - smooth or instant
   */
  scrollToBottomOfContent(style: any): void {
    try {
      let content = document.getElementById('chat-content') || undefined;
      content.scrollTo({ top: content.scrollHeight, behavior: style });
    } catch (err) {}
  }

  /**
   * set the editor status and scroll to the bottom of the channel-content
   */
  setEditorStatus() {
    this.showEditor = !this.showEditor;
    setTimeout(() => {
      this.scrollToBottomOfContent('smooth');
    }, 100);
  }

  /**
   * check the window height and set the editor status
   */
  checkWindowHeight() {
    if (window.innerHeight < 600) {
      this.showEditor = false;
    } else {
      this.showEditor = true;
    }
  }

  /**
   * event listener for window height
   */
  eventListenerWindowHeight() {
    window.addEventListener('resize', () => {
      if (window.innerHeight < 600) {
        this.showEditor = false;
      } else {
        this.showEditor = true;
      }
    });
  }
}
