import { Component, OnInit } from '@angular/core';
import { Thread } from 'src/app/models/thread.class';
import { ChannelService } from 'src/app/services/channel.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UsersService } from 'src/app/services/users.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss']
})
export class ThreadsComponent implements OnInit {

  currentUserId: string;
  currentUserData: any = [];
  allThreads: Thread[] = [];
  allUser: any = [];
  allReplies: any = [];
  threadsFromCurrentUser: Thread[] = [];
  name: string;
  moreThanFive: boolean = false;



  constructor(
    public firestoreService: FirestoreService,
    public usersService: UsersService,
    public channelService: ChannelService
  ) {

  }

  async ngOnInit(): Promise<void> {
    await this.getAllThreads();
    this.getCurrentUserData();
    this.getCurrentUserId();
    this.getThreadsFromCurrentUser();
    this.getAllUser();
  }

  async getAllThreads() {
    this.allThreads = await this.firestoreService.getAllThreads();
    console.log('Threadslist comes from the thread component:', this.allThreads);
  }

  getCurrentUserId() {
    this.currentUserId = this.usersService.currentUserId$;
    console.log('Current User Id comes from the thread component', this.currentUserId);
  }

  async getCurrentUserData() {
    this.currentUserData = await this.usersService.getCurrentUserData();
    console.log('Current user data comes from the thread component', this.currentUserData);
  }

  getThreadsFromCurrentUser() {
    for (let i = 0; i < this.allThreads.length; i++) {
      if (this.allThreads[i]['user'] == this.currentUserId) {
        this.threadsFromCurrentUser.push(this.allThreads[i]);
      }
      i++;
    }
    console.log('Threads from current User', this.threadsFromCurrentUser);
  }

  getAllUser() {
    this.allUser = this.usersService.getAllUsers();
    console.log('All Users comes from thread component:', this.allUser);
  }
}
