import { Component, OnInit } from '@angular/core';
import { Thread } from 'src/app/models/thread.class';
import { ChannelService } from 'src/app/services/channel.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UsersService } from 'src/app/services/users.service';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss'],
})
export class ThreadsComponent implements OnInit {
  currentUserId: string;
  currentUserData: any = [];
  allThreads: Thread[] = [];
  allUser: any = [];
  threadsFromCurrentUser: Thread[] = [];
  name: string;
  currentUser;
  showImage;

  constructor(
    public firestoreService: FirestoreService,
    public usersService: UsersService,
    public channelService: ChannelService,
    public globalService: GlobalService,
  ) {
  }

  async ngOnInit(): Promise<void> {
    await this.getAllThreads();
    this.getCurrentUserData();
    this.getCurrentUserId();
    this.getThreadsFromCurrentUser();
    this.getAllUser();
  }

  /**
  * Gets all the threads from the Firestore
  */
  async getAllThreads() {
    this.allThreads = await this.firestoreService.getAllThreads();
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
   * Only retrieves the threads from the Firestore that belong to the current user
   */
  getThreadsFromCurrentUser() {
    for (let i = 0; i < this.allThreads.length; i++) {
      if (this.allThreads[i]['user'] == this.currentUserId) {
        this.threadsFromCurrentUser.push(this.allThreads[i]);
      }
      i++;
    }
  }

  /**
   * Gets all users from the Firestore
   */
  getAllUser() {
    this.allUser = this.usersService.getAllUsers();
  }

  /**
  * Fetches the information for the user to display user details as a pop-up window
  */
  getUserInformation() {
    let currentUserId = this.channelService.activeThread.user['id'];
    this.openProfileDetail(currentUserId);
  }

  /**
   * Fetches the information for the user to display user details as a pop-up window
   * But this time from the replies
  */
  getUserInformationFromReplies(user) {
    let currentUserId = user['id'];
    this.openProfileDetail(currentUserId);
  }

  /**
  *  Opens the profile details in the pop-up window
  */
  openProfileDetail(currentUserId) {
    for (let i = 0; i < this.allUser.length; i++) {
      if (currentUserId == this.allUser[i].uid) {
        this.currentUser = this.allUser[i];
      }
    }
    let name = this.currentUser.displayName;
    let image = this.currentUser.photoURL;
    let email = this.currentUser.email;
    this.channelService.messageDialogOpen(
      name,
      image,
      email,
      currentUserId
    );
  }

  /**
  *  Closes the thread
  */
  closeThread() {
    this.globalService.threadsRightSideOpened = false;
  }
}
