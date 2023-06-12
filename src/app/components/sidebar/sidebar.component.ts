import { Component, OnInit } from '@angular/core';
import { Channel } from 'src/app/models/channel.class';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ChannelService } from 'src/app/services/channel.service';
import { DialogCreateNewChannelComponent } from '../dialog-create-new-channel/dialog-create-new-channel.component';
import { MatDialog } from '@angular/material/dialog';




@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  channelsAreOpen = true;
  directmessagesAreOpen = true;
  channels: Channel[] = [];

  constructor(private firestoreService: FirestoreService,
    private channelService: ChannelService,
    public createChannelDialog: MatDialog,
    ) {}

  async ngOnInit() {
    this.channels = await this.firestoreService.readChannels();
    console.log('Channels', this.channels)
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

}