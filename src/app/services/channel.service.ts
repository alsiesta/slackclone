import { EventEmitter, Injectable } from '@angular/core';
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
  unfilterdThreads: Array<any> = [];
  activeChannel: any;
  defaultChannelId: string = 'gruppe-576'; //to be changed to #allgemein?
  channelReady: boolean = false;
  message = new Thread();
  activeThread = new Thread();
  amountReplies: number;
  show: boolean = true;
  single: boolean;
  plural: boolean;
  specificThread: any = [];
  allUsers: any = [];
  name: string;
  scrollStatus: EventEmitter<boolean> = new EventEmitter<boolean>();

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
    this.findChannel(channelID);
    this.findThreads(channelID);
    this.findDates();
    this.sortThreads();
    this.setUserInChannelThreads();
    setTimeout(() => {
      this.scrollStatus.emit(false);
    }, 10);
    this.channelReady = true;
  }

  /**
   * update the channel content when a new thread is added
   */
  updateChannelContent(filteredThreads?: Array<any>) {
    this.findChannel(this.defaultChannelId);
    this.findThreads(this.defaultChannelId, filteredThreads);
    this.findDates();
    this.sortThreads();
    this.setUserInChannelThreads();
  }

  /**
   * sort the channelThreads by time
   */
  sortThreads() {
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
   * find the filterd threads in threadList for active channel
   * @param channelID - channel id from function loadChannelContent
   */
  findThreads(channelID: string, filteredThreads?: Array<any>) {
    this.channelThreads = [];
    this.unfilterdThreads = [];
    this.threadList.forEach((element: any) => {
      if (element.channel == channelID) {
        this.channelThreads.push(element);
        this.unfilterdThreads.push(element);
      }
    });

    if (filteredThreads) {
      this.channelThreads = filteredThreads;
    }
  }

  /**
   * find the dates in channelThreads and push them to dateList
   */
  findDates() {
    this.dateList = [];
    this.channelThreads.forEach((element: any) => {
      this.dateList.push(element.date.split('T')[0]);
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
    this.firestoreService.addNewThread(this.message).then(() => {
      this.scrollStatus.emit(true);
    });
  }

  /**
   * open thread component and set active thread
   */
  openThread(thread: any) {
    this.activeThread = thread;
    this.getAmountReplies();
    this.globalService.threadsRightSideOpened = true;
    this.getNameOpenThread();
    this.getUserNameReplies();
  }

  async updateThread() {
    this.specificThread = await this.firestoreService.getSpecificThread(
      this.activeThread.threadId
    );
    this.activeThread = this.specificThread;
    this.getNameOpenThreadAfterUpdate();
    this.getUserNameRepliesAfterUpdate();
    this.getAmountReplies();
  }

  async getUserNameReplies() {
    this.allUsers = await this.userService.getAllUsers();
    for (let i = 0; i < this.activeThread.replies.length; i++) {
      //i = 3
      for (let j = 0; j < this.allUsers.length; j++) {
        // j = 5
        if (this.activeThread.replies[i].user['id'] == this.allUsers[j].uid) {
          //this.activeThread.user['name'] = this.allUsers[j].displayName;
        }
      }
    }
  }

  async getUserNameRepliesAfterUpdate() {
    this.allUsers = await this.userService.getAllUsers();
    for (let i = 0; i < this.activeThread.replies.length; i++) {
      //i = 3
      for (let j = 0; j < this.allUsers.length; j++) {
        // j = 5
        if (this.activeThread.replies[i].user == this.allUsers[j].uid) {
          this.setUserDataInThreads(
            this.activeThread.replies[i],
            this.allUsers[j]
          );
          //this.activeThread.user['name'] = this.allUsers[j].displayName;
        }
      }
    }
  }

  async getNameOpenThread() {
    this.allUsers = await this.userService.getAllUsers();
    for (let i = 0; i < this.allUsers.length; i++) {
      if (this.activeThread.user['id'] == this.allUsers[i].uid) {
        this.name = this.allUsers[i].displayName;
      }
    }
  }

  async getNameOpenThreadAfterUpdate() {
    this.allUsers = await this.userService.getAllUsers();
    for (let i = 0; i < this.allUsers.length; i++) {
      if (this.activeThread.user == this.allUsers[i].uid) {
        this.name = this.allUsers[i].displayName;
      }
    }
  }

  noComment() {
    if (this.activeThread.replies.length == 0) {
      this.show = false;
    } else {
      this.show = true;
    }
  }

  getAmountReplies() {
    this.noComment();
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
