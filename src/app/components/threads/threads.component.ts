import { Component, OnInit } from '@angular/core';
import { Thread } from 'src/app/models/thread.class';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-threads',
  templateUrl: './threads.component.html',
  styleUrls: ['./threads.component.scss']
})
export class ThreadsComponent implements OnInit {

  currentUserId: string;
  allThreads: Thread[] = [];
  threadsFromCurrentUser: Thread[] = [];
  name: string;

  constructor(
    public firestoreService: FirestoreService,
    public usersService: UsersService,
  ) {

  }

  ngOnInit(): void {
    this.getAllThreads();
    this.getCurrentUserId();
    this.getThreadsFromCurrentUser();
  }

  async getAllThreads() {
    this.allThreads = await this.firestoreService.getAllThreads();
    // console.log('User from threads 0', this.allThreads[0]['user']);
    // console.log('User from threads 1', this.allThreads[1]['user']);
    // console.log('User from threads 2', this.allThreads[2]['user']);
    // console.log('User from threads 3', this.allThreads[3]['user']);
    // console.log('User from threads 4', this.allThreads[4]['user']);
    // console.log('User from threads 5', this.allThreads[5]['user']);
    // console.log('User from threads 6', this.allThreads[6]['user']);
    // console.log('User from threads 7', this.allThreads[7]['user']);
    // console.log('User from threads 8', this.allThreads[8]['user']);
    // console.log('User from threads 9', this.allThreads[9]['user']);
    // console.log('User from threads 10', this.allThreads[10]['user']);
    // console.log('User from threads 11', this.allThreads[11]['user']);
    console.log('Threadslist comes from the thread component:', this.allThreads);
  }

  getCurrentUserId() {
    this.currentUserId = this.usersService.currentUserId$;
    console.log('Current User Id comes from the thread component', this.currentUserId);
  }

  getThreadsFromCurrentUser() {
    for(let i = 0; i < this.allThreads.length; i++) {
      if(this.allThreads[i]['user'] == this.currentUserId) {
        console.log(this.allThreads[i]['user']);
        console.log(this.currentUserId);
        console.log(i + '. Match');
        this.threadsFromCurrentUser.push(this.allThreads[i]);
      }
      i++;
    }
    console.log('Threads from current User', this.threadsFromCurrentUser);
  }

  // get currentUserId$() {
  //   return this.usersService.currentUserId$;
  // }
}
