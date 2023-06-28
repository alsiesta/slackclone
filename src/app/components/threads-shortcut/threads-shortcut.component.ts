import { ChannelService } from 'src/app/services/channel.service';
import { UsersService } from 'src/app/services/users.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Component } from '@angular/core';
import { Thread } from 'src/app/models/thread.class';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-threads-shortcut',
  templateUrl: './threads-shortcut.component.html',
  styleUrls: ['./threads-shortcut.component.scss']
})
export class ThreadsShortcutComponent {
  currentUserId: string;
  currentUserData: any = [];
  currentThread: any = [];
  currentReply: any = [];
  allThreads: Thread[] = [];
  threadsFromCurrentUser: Thread[] = [];
  names: any = [];
  observerThreadList: Observable<any>;
  allUser: any = [];
  n: number;

  constructor(
    public firestoreService: FirestoreService,
    public usersService: UsersService,
    public channelService: ChannelService
  ) {
    this.observerThreadList = this.firestoreService.getThreadList();
    this.observerThreadList.subscribe((threads) => {
      this.allThreads = threads;
      this.updateContent();
      //this.channelService.sortThreads();
    });
  }

  async ngOnInit(): Promise<void> {
    await this.getAllThreads();
  }

  async getAllThreads() {
    this.allThreads = await this.firestoreService.getAllThreads();
    // console.log('Threadslist comes from the thread-shortcut component:', this.allThreads);
    this.updateContent();
  }

  updateContent() {
    this.updateThreads();
  }

  getCurrentUserId() {
    this.currentUserId = this.usersService.currentUserId$;
    // console.log('Current User Id comes from the thread-shortcut component', this.currentUserId);
  }

  async getCurrentUserData() {
    this.currentUserData = await this.usersService.getCurrentUserData();
    // console.log('Current user data comes from the thread-shortcut component', this.currentUserData);
  }

  async getAllUser() {
    await this.firestoreService.getAllUsers().then((users) => {
      // console.log('All Users', users);
      this.allUser = users;
    });
  }

  async updateThreads() {
    await this.getCurrentUserData();
    await this.getCurrentUserId();
    this.threadsFromCurrentUser = [];
    for (let i = 0; i < this.allThreads.length; i++) {
      if (this.allThreads[i]['user'] == this.currentUserId) {
        this.threadsFromCurrentUser.push(this.allThreads[i]);
      }
    }
    await this.getNameOfReply();
    console.log('Threads from current User', this.threadsFromCurrentUser);
  }

  async getNameOfReply() {
    await this.getAllUser();
    // console.log('All User Liste:', this.allUser);
    for (let i = 0; i < this.threadsFromCurrentUser.length; i++) {
      //this.checkAmountComments(i);
      // console.log(' this.threadsFromCurrentUser[i].replies', this.threadsFromCurrentUser[i].replies);
      // console.log('this.threadsFromCurrentUser[i].replies.length:', this.threadsFromCurrentUser[i].replies.length);
      for (this.n = 0; this.n < this.threadsFromCurrentUser[i].replies.length; this.n++) {
        for (let j = 0; j < this.allUser.length; j++) {
          if (this.threadsFromCurrentUser[i].replies[this.n].user == this.allUser[j].uid) {
            // console.log('this.threadsFromCurrentUser[i].replies[n]', this.threadsFromCurrentUser[i].replies[this.n]);
            // console.log('allUser[j]', this.allUser[j]);
            this.extensionUser(i, this.n, j);
          }
        }
      }
    }
  }

  extensionUser(i: number, n: number, j: number) {
    this.channelService.setUserDataInThreads(
      this.threadsFromCurrentUser[i].replies[n],
      this.allUser[j]
    );
  }

  getUserInformation(thread) {
    this.currentThread = thread;
    let curentUserId = this.currentThread['user'];
    this.openProfileDetail(curentUserId, this.currentThread);
  }

  getUserInformationReplies(threadReply) {
    this.currentReply = threadReply;
    let currentUserId = this.currentReply.user['id'];
    this.openProfileDetail(currentUserId, this.currentReply);
  }

  openProfileDetail(currentUserId, thread) {
    for (let i = 0; i < this.allUser.length; i++) {
      if (currentUserId == this.allUser[i].uid) {
        thread = this.allUser[i];
      }
    }
    let name = thread.displayName;
    let image = thread.photoURL;
    let email = thread.email;
    this.channelService.messageDialogOpen(
      name,
      image,
      email,
      this.currentUserId
    );
  }
}
