import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChannelDialogComponent } from '../components/channel-dialog/channel-dialog.component';
import { FirestoreService } from './firestore.service';
import { DialogNewMessageComponent } from '../components/dialog-new-message/dialog-new-message.component';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  channelList: any;
  activeChannel: any;
  channelReady: boolean = false;

  //posting object
  postings: Array<any> = [
    {
      user: 'John Doe',
      image: 'assets/img/threads/profile-picture.png',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nunc aliquet nunc',
      date: '03.06.2023',
      time: '16:25',
      id: '1234567890',
      threads: [],
    },
    {
      user: 'Joana Denver',
      image: 'assets/img/threads/profile-picture.png',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nunc aliquet nunc',
      date: '04.06.2023',
      time: '18:25',
      id: '1234567891',
      threads: [
        {
          user: 'John Doe',
          image: 'assets/img/threads/profile-picture.png',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          date: '04.06.2023',
        },
        {
          user: 'Maxi Muster',
          image: 'assets/img/threads/profile-picture.png',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          date: '04.06.2023',
        },
      ],
    },
  ];

  // to be implemented by function
  dates: Array<any> = ['03.06.2023', '04.06.2023'];

  constructor(
    public channelDialog: MatDialog,
    public messageDialog: MatDialog,
    public firestoreService: FirestoreService
  ) {}

  /**
   * open the channel-info dialog
   */
  channelDialogOpen() {
    const dialogRef = this.channelDialog.open(ChannelDialogComponent, {
      maxWidth: '100vw',
    });
  }

  /**
   * open the channel-info dialog
   */
  messageDialogOpen(user: string, image: string) {
    const dialogRef = this.messageDialog.open(DialogNewMessageComponent, {
      data: { user: user, image: image },
      maxWidth: '100vw',
    });
  }

  /**
   * load the channel content from firestore.service
   */
  async loadChannelContent(channelID: string) {
    this.channelReady = false;
    await this.firestoreService.readChannels().then(() => {
      this.channelList = this.firestoreService.channelList;
    });
    this.findChannel(channelID);
    console.log(this.activeChannel);
    this.channelReady = true;
  }

  /**
   * find the channel in channelList
   * @param channelID - channel id from function loadChannelContent
   */
  findChannel(channelID: string) {
    this.channelList.forEach((element: any) => {
      if (element.id == channelID) {
        this.activeChannel = element;
      }
    });
  }
}
