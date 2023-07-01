import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChannelService } from 'src/app/services/channel.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SearchService } from 'src/app/services/search.service';

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
    public firestoreService: FirestoreService,
    public searchService: SearchService
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

  /**
   * scroll to the bottom of the channel-content
   * @param style - smooth or instant
   */
  scrollToBottomOfContent(style: any): void {
    try {
      let content = document.getElementById('channel-content') || undefined;
      content.scrollTo({ top: content.scrollHeight, behavior: style });
    } catch (err) {}
    this.setSearchFunction();
  }

  setSearchFunction() {
    this.searchService.activeChannel = this.channelService.activeChannel;
    this.searchService.activeChat = '';
    this.searchService.activeThread = '';
    this.searchService.activeUsers = '';
    this.searchService.findActiveComponent();
  }
}
