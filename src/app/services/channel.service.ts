import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChannelDialogComponent } from '../components/channel-dialog/channel-dialog.component';
import { FirestoreService } from './firestore.service';
import { DialogNewMessageComponent } from '../components/dialog-new-message/dialog-new-message.component';
import { GlobalService } from './global.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  channelList: Array<any>;
  observerThreadList: Observable<any>;
  threadList: Array<any> = [];
  userList: Array<any> = [];
  dateList: Array<any> = [];
  channelThreads: Array<any> = [];
  activeChannel: any;
  channelReady: boolean = false;

  constructor(
    public channelDialog: MatDialog,
    public messageDialog: MatDialog,
    public firestoreService: FirestoreService,
    public globalService: GlobalService
  ) {
    this.observerThreadList = this.firestoreService.getThreadList();
    this.observerThreadList.subscribe((threads) => {
      this.threadList = threads;
      this.updateChannelContent();
      console.log('threadList updated');
    });
  }

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
    await this.firestoreService.getAllUsers().then(() => {
      this.userList = this.firestoreService.usersList;
    });

    this.findChannel(channelID);
    this.findThreads(channelID);
    this.findDates();
    this.sortThreadsByTime();
    this.setUserInChannelThreads();

    this.channelReady = true;
  }

  updateChannelContent() {
    this.findChannel('gruppe-576');
    this.findThreads('gruppe-576');
    this.findDates();
    this.sortThreadsByTime();
    this.setUserInChannelThreads();
  }

  /**
   * sort the channelThreads by time
   */
  sortThreadsByTime() {
    this.channelThreads = this.globalService.sortThreadsByTime(
      this.channelThreads
    );
  }

  /**
   * find the channel in channelList
   * @param channelID - channel id from function loadChannelContent
   */
  findChannel(channelID: string) {
    this.channelList?.forEach((element: any) => {
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
    this.channelThreads = [];
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
    this.dateList = [];
    this.channelThreads.forEach((element: any) => {
      this.dateList.push(element.date);
    });
    this.dateList = this.globalService.uniqueDateList(this.dateList);
    this.dateList = this.globalService.sortingDateList(this.dateList);
  }

  /**
   * add user data in channelThreads
   */
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
