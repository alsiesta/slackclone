import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit, OnDestroy, AfterViewChecked {
  constructor(public channelService: ChannelService) {}

  ngOnInit(): void {
    this.channelService.loadChannelContent('gruppe-576');
  }

  ngAfterViewChecked(): void {
    this.scrollToBottomOfContent();
  }

  ngOnDestroy(): void {
    this.channelService.channelReady = false;
  }

  scrollToBottomOfContent(): void {
    let content = document.getElementById('channel-content') || undefined;

    try {
      content.scrollTo(0, content.scrollHeight);
    } catch (error) {
    }
  }
}
