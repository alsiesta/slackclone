import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChannelDialogComponent } from '../components/channel-dialog/channel-dialog.component';
import { FirestoreService } from './firestore.service';
import { DialogNewMessageComponent } from '../components/dialog-new-message/dialog-new-message.component';
import { GlobalService } from './global.service';
import { Thread } from '../models/thread.class';
import { UsersService } from './users.service';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  channelList: Array<any>;
  threadList: Array<any> = [];
  userList: Array<any> = [];
  dateList: Array<any> = [];
  channelThreads: Array<any> = [];
  activeChannel: any;
  defaultChannelId: string = 'gruppe-576'; //to be changed to #allgemein?
  channelReady: boolean = false;
  message = new Thread();
  activeThread = new Thread();
  threadsOpen: boolean = false;
  amountReplies: number;
  show: boolean = true;
  single: boolean;
  plural: boolean;

  constructor(
    public channelDialog: MatDialog,
    public messageDialog: MatDialog,
    public firestoreService: FirestoreService,
    public globalService: GlobalService,
    public userService: UsersService,
    public chatService: ChatService
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
   * open the user-info dialog
   */
  messageDialogOpen(user: string, image: string, email: string, id: string) {
    const dialogRef = this.messageDialog.open(DialogNewMessageComponent, {
      data: { user: user, image: image, email: email, id: id },
      maxWidth: '100vw',
    });
  }

  /**
   * load the channel content from firestore.service
   */
  async loadChannelContent(channelID?: string) {
    channelID = channelID ? channelID : this.defaultChannelId;
    this.channelReady = false;
    await this.firestoreService.readChannels().then(() => {
      this.channelList = this.firestoreService.channelList;
    });
    await this.firestoreService.getAllUsers().then(() => {
      this.userList = this.firestoreService.usersList;
    });
    this.chatService.chatOpen = false;
    this.findChannel(channelID);
    this.findThreads(channelID);
    this.findDates();
    this.sortThreadsByTime();
    this.setUserInChannelThreads();
    this.channelReady = true;
  }

  /**
   * update the channel content when a new thread is added
   */
  updateChannelContent() {
    this.findChannel(this.defaultChannelId);
    this.findThreads(this.defaultChannelId);
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
        this.defaultChannelId = this.activeChannel.id;
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
    this.dateList = this.globalService.uniqueList(this.dateList);
    this.dateList = this.globalService.sortingDateList(this.dateList);
  }

  /**
   * add user data in channelThreads
   */
  setUserInChannelThreads() {
    this.channelThreads.forEach((thread: any) => {
      this.userList.forEach((user: any) => {
        if (thread.user == user.id) {
          this.setUserDataInThreads(thread, user);
        }
        if (thread.replies.length > 0) {
          thread.replies.forEach((reply: any) => {
            if (reply.user == user.id) {
              this.setUserDataInThreads(reply, user);
            }
          });
        }
      });
    });
  }

  /**
   * sets the user data in thread or reply
   * @param threadObject - thread or reply from channelThreads
   * @param user - user from userList
   */
  setUserDataInThreads(threadObject: any, user: any) {
    threadObject.user = {
      id: user.id,
      name: user.displayName,
      image: user.photoURL
        ? user.photoURL
        : 'assets/img/threads/profile-picture.png',
      email: user.email,
    };
  }

  /**
   * creating new thread in firestore
   * @param content - message content from text editor
   */
  addNewMessage(content: string) {
    this.message = {
      channel: this.activeChannel.id,
      content: content,
      date: new Date(),
      replies: [],
      threadId: '',
      time: new Date(),
      user: this.userService.currentUserId$,
    };    
    this.firestoreService.addNewThread(this.message);
  }

  /**
   * open thread component and set active thread
   */
  openThread(thread: any) {
    this.activeThread = thread;
    this.threadsOpen = true;
    this.getAmountReplies();

    console.log(
      'I come from channel service:',
      this.activeChannel.title,
      this.activeThread
    );
  }

  noComment() {
    if(this.activeThread.replies.length == 0) {
      this.show = false;
    } else {
      this.show = true;
    }
  }

  getAmountReplies() {
    this.noComment()
    if (this.activeThread.replies.length == 1) {
      this.single = true;
      this.plural = false;
    } else {
      this.single = false;
      this.plural = true;
    }
    this.amountReplies = this.activeThread.replies.length;
  }
}
