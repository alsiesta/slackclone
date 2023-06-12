import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChannelDialogComponent } from '../components/channel-dialog/channel-dialog.component';
import { FirestoreService } from './firestore.service';
import { DialogNewMessageComponent } from '../components/dialog-new-message/dialog-new-message.component';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  channelList: Array<any>;
  threadList: Array<any>;
  userList: Array<any> = [];
  dateList: Array<any> = [];
  channelThreads: Array<any> = [];
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
  messageDialogOpen(user: string, image: string, email: string) {
    const dialogRef = this.messageDialog.open(DialogNewMessageComponent, {
      data: { user: user, image: image, email: email },
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
    await this.firestoreService.getAllThreads().then(() => {
      this.threadList = this.firestoreService.threadList;
    });
    await this.firestoreService.getAllUsers().then(() => {
      this.userList = this.firestoreService.usersList;
    });

    this.findChannel(channelID);
    this.findThreads(channelID);
    this.findDates();
    this.setUserInChannelThreads();

    console.log(this.channelThreads);

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

  /**
   * find the threads in threadList for active channel
   * @param channelID - channel id from function loadChannelContent
   */
  findThreads(channelID: string) {
    this.threadList.forEach((element: any) => {
      if (element.channel == channelID) {
        this.channelThreads.push(element);
      }
    });
  }

  /**
   * find the dates in channelThreads and push them to dateList
   */
  findDates() {
    this.channelThreads.forEach((element: any) => {
      this.dateList.push(element.date);
    });
    this.uniqueDateList();
    this.sortingDateList();
    console.log(this.dateList);
  }

  /**
   * filter the dateList for unique dates and push them to dateList
   */
  uniqueDateList() {
    let uniqueDateList = this.dateList.filter(
      (value, index, array) => array.indexOf(value) === index
    );
    this.dateList = [];
    uniqueDateList.forEach((element: any) => {
      this.dateList.push(element);
    });
  }

  /**
   * sort the dateList
   */
  sortingDateList() {
    this.dateList.sort((a, b) => a - b);
  }

  setUserInChannelThreads() {
    this.channelThreads.forEach((thread: any) => {
      this.userList.forEach((user: any) => {
        if (thread.user == user.id) {
          thread.user = {
            id: user.id,
            name: user.displayName,
            image: user.photoURL
              ? user.photoURL
              : 'assets/img/threads/profile-picture.png',
            email: user.email,
          };
        }
      });
    });
  }
}
