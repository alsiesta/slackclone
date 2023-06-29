import { Component } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';
import { ChatService } from 'src/app/services/chat.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  constructor(
    public channelService: ChannelService,
    public chatService: ChatService,
    public globalService: GlobalService
  ) {}
}
