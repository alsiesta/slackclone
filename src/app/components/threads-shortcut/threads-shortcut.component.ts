import { ChannelService } from 'src/app/services/channel.service';
import { UsersService } from 'src/app/services/users.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { Component } from '@angular/core';
import { Thread } from 'src/app/models/thread.class';
import { Observable } from 'rxjs';
import { SearchService } from 'src/app/services/search.service';
import { GlobalService } from 'src/app/services/global.service';

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
  searchThreadsStatus = this.searchService.searchThreadsStatus;
  filteredThreads: any;

  constructor(
    public firestoreService: FirestoreService,
    public usersService: UsersService,
    public channelService: ChannelService,
    public searchService: SearchService,
    public globalService: GlobalService
  ) {
    this.observerThreadList = this.firestoreService.getThreadList();
    this.observerThreadList.subscribe((threads) => {
      this.allThreads = threads;
      this.updateContent();
    });
    this.searchThreads();
  }

  async ngOnInit(): Promise<void> {
    await this.getAllThreads();
  }

  /**
   * Search for specific threads
   */
  searchThreads() {
    this.searchThreadsStatus.subscribe((status) => {
      if (status) {
        this.filteredThreads = this.searchService.filteredThreads;
        this.updateThreads(this.filteredThreads);
      } else {
        this.filteredThreads = [];
      }
    });
  }

  /**
  * Gets all the threads from the Firestore
  */
  async getAllThreads() {
    this.allThreads = await this.firestoreService.getAllThreads();
    this.updateContent();
  }

  /**
  * Updates the threads as soon as a new reply is added
  */
  updateContent() {
    this.updateThreads();
  }

  /**
  * Fetches the ID for the user who is currently logged in
  */
  getCurrentUserId() {
    this.currentUserId = this.usersService.currentUserId$;
  }

  /**
   * Fetches the user data of the currently logged in user
   */
  async getCurrentUserData() {
    this.currentUserData = await this.usersService.getCurrentUserData();
  }

  /**
   * Gets all users from the Firestore
   */
  async getAllUser() {
    await this.firestoreService.getAllUsers().then((users) => {
      this.allUser = users;
    });
  }

  /**
  * Updates the threads as soon as a new reply is added
  */
  async updateThreads(filteredThreads?: any) {
    await this.getCurrentUserData();
    await this.getCurrentUserId();
    this.threadsFromCurrentUser = [];
    this.searchService.unfilteredThreads = [];
    this.threadsCurrentUser();
    if (filteredThreads) {
      this.threadsFromCurrentUser = filteredThreads;
    }
    await this.getNameOfReply();
  }

  /**
  * Pick the threads from the current user
  */
  threadsCurrentUser() {
    for (let i = 0; i < this.allThreads.length; i++) {
      if (this.allThreads[i]['user'] == this.currentUserId) {
        this.threadsFromCurrentUser.push(this.allThreads[i]);
        this.searchService.unfilteredThreads.push(this.allThreads[i])
      }
    }
  }

  /**
  * Adds the name of the user who replied to a specific thread
  */
  async getNameOfReply() {
    this.threadsFromCurrentUser = this.globalService.sortingThreadsOnDate(this.threadsFromCurrentUser);
    await this.getAllUser();
    for (let i = 0; i < this.threadsFromCurrentUser.length; i++) {
      for (this.n = 0; this.n < this.threadsFromCurrentUser[i].replies.length; this.n++) {
        for (let j = 0; j < this.allUser.length; j++) {
          if (this.threadsFromCurrentUser[i].replies[this.n].user == this.allUser[j].uid) {
            this.extensionUser(i, this.n, j);
          }
        }
      }
    }
  }

  /**
  * Extends the user json with further attributes
  */
  extensionUser(i: number, n: number, j: number) {
    this.channelService.setUserDataInThreads(
      this.threadsFromCurrentUser[i].replies[n],
      this.allUser[j]
    );
  }

  /**
  * Fetches the information for the user to display user details as a pop-up window
  */
  getUserInformation(thread) {
    this.currentThread = thread;
    let curentUserId = this.currentThread['user'];
    this.openProfileDetail(curentUserId, this.currentThread);
  }

  /**
   * Fetches the information for the user to display user details as a pop-up window
   * But this time from the replies
  */
  getUserInformationReplies(threadReply) {
    this.currentReply = threadReply;
    let currentUserId = this.currentReply.user['id'];
    this.openProfileDetail(currentUserId, this.currentReply);
  }

  /**
  *  Opens the profile details in the pop-up window
  */
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
      currentUserId
    );
  }
}
