import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements AfterViewChecked, OnDestroy, OnInit {
  observerChatList: Observable<any>;

  constructor(
    public chatService: ChatService,
    public firestoreservice: FirestoreService
  ) {
    this.observerChatList = this.firestoreservice.observeChat$;
    this.observerChatList.subscribe((chats) => {
      this.chatService.chatList = chats;
      this.chatService.updateChatContent();
    });
  }

  ngOnInit(): void {
    //this.chatService.loadChatContent();
  }

  ngAfterViewChecked(): void {
    this.scrollToBottomOfContent();
  }

  ngOnDestroy(): void {
    this.chatService.chatReady = false;
  }

  scrollToBottomOfContent(): void {
    let content = document.getElementById('chat-content') || undefined;

    try {
      content.scrollTo(0, content.scrollHeight);
    } catch (error) {}
  }
}
