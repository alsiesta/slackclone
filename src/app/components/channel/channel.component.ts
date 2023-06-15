import { AfterViewChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChannelService } from 'src/app/services/channel.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-channel',
  templateUrl: './channel.component.html',
  styleUrls: ['./channel.component.scss'],
})
export class ChannelComponent implements OnInit, OnDestroy, AfterViewChecked {
  observerThreadList: Observable<any>;

  constructor(
    public channelService: ChannelService,
    public firestoreService: FirestoreService
  ) {
    this.observerThreadList = this.firestoreService.getThreadList();
    this.observerThreadList.subscribe((threads) => {
      this.channelService.threadList = threads;
      this.channelService.updateChannelContent();
    });
  }

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
    } catch (error) {}
  }
}
