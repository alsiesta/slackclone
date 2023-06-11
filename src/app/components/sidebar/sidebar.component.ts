import { Component, OnInit } from '@angular/core';
import { Channel } from 'src/app/models/channel.class';
import { FirestoreService } from 'src/app/services/firestore.service';





@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  channelsAreOpen = true;
  directmessagesAreOpen = true;
  channels: Channel[] = [];

  constructor(private firestoreService: FirestoreService) {}

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

}