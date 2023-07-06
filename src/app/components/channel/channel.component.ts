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
  showEditor = true;
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
    this.checkWindowHeight();
    this.eventListenerWindowHeight();
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

  /**
   * set the search function for channel component
   */
  setSearchFunction() {
    this.searchService.activeChannel = this.channelService.activeChannel;
    this.searchService.activeChat = '';
    this.searchService.activeThread = '';
    this.searchService.activeUsers = '';
    this.searchService.findActiveComponent();
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
