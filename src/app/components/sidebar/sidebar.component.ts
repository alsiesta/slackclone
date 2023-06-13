import { Component, OnInit } from '@angular/core';
import { Channel } from 'src/app/models/channel.class';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ChannelService } from 'src/app/services/channel.service';
import { DialogCreateNewChannelComponent } from '../dialog-create-new-channel/dialog-create-new-channel.component';
import { MatDialog } from '@angular/material/dialog';
import { Thread } from 'src/app/models/thread.class';




@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  channelsAreOpen = true;
  directmessagesAreOpen = true;
  channels: Channel[] = [];
  threads: Thread[] = [];

  constructor(private firestoreService: FirestoreService,
    private channelService: ChannelService,
    public createChannelDialog: MatDialog,
    ) {}

  async ngOnInit() {
    this.channels = await this.firestoreService.readChannels();
    this.threads = await this.firestoreService.getAllThreads();
    console.log('Channels', this.channels)
    console.log('Threads', this.threads)
  }

  toggleDropdown(key) {
    switch (key) {
      case 'ch':
          this.channelsAreOpen = !this.channelsAreOpen;
        break;

      case 'dm':
          this.directmessagesAreOpen = !this.directmessagesAreOpen;
        break;

      default:
        break;
    }
  }

  openCreateChannelDialog() {
    const dialogRef = this.createChannelDialog.open(DialogCreateNewChannelComponent, {
      maxWidth: '100vw',
    });
  }

  renderChannel(channel) {
    this.channelService.loadChannelContent(channel.id);
  }

  logThreads() {
    // this.firestore.addNewThread(this.mockThreadData);
    // this.firestore.getSpecificThread('9yuMwkxvzhfhM8QEn8qm');
    this.firestoreService.getAllThreads();
  }

}