import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChannelService } from 'src/app/services/channel.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit, OnDestroy {
  observerThreadList: Observable<any>;
  scrollStatus = this.channelService.scrollStatus;

  constructor(
    public channelService: ChannelService,
    public firestoreService: FirestoreService
  ) {
    this.observerThreadList = this.firestoreService.getThreadList();
    this.observerThreadList.subscribe((threads) => {
      this.channelService.threadList = threads;
      this.channelService.updateChannelContent();
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
    this.channelService.loadChannelContent();
  }

  ngOnDestroy(): void {
    this.channelService.channelReady = false;
  }

  scrollToBottomOfContent(style: any): void {
    let content = document.getElementById('channel-content') || undefined;
    content.scrollTo({ top: content.scrollHeight, behavior: style });
  }
}
