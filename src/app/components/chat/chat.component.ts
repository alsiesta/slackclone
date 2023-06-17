import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements AfterViewChecked, OnDestroy, OnInit {
  constructor(public chatService: ChatService) {}

  ngOnInit(): void {
    //this.chatService.loadChannelContent();
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
