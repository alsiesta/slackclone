import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(
    public authService: AuthService,
    private router: Router,
    public usersService: UsersService,
    public firestore: FirestoreService,
    public dialog: MatDialog
  ) {}

  currentUserDisplayName: any;
  ngOnInit() {
    // this.loglocalStorage();
  }

  /// delete after chat form is finished /////////
  mockChatData = {
    chatId: 'Muster Chat ID',
    chatUsers: ['User 1', 'User 2', 'User 3'],
    chat: [
      {
        user: 'User 1',
        date: new Date(),
        message:
          'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt',
      },
    ],
  };
  //////////////////////////////////

  /// delete after thread form is finished /////////
  mockThreadData = {
    threadId: '',
    user: 'KeejR8OjlSYfGHpGq2XV3bNytTH2',
    date: new Date(),
    time: new Date(),
    content:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam',
    channel: 'gruppe-576',
    replies: [
      {
        user: 'User 33',
        date: new Date(),
        message: 'Lorem ipsum dolor sit amet, consetetur sadipscing',
      },
      {
        user: 'User 55',
        date: new Date(),
        message: 'Lorem ipsum',
      },
      /* {
      user: 'User 23',
      date: new Date(),
      message: 'Lorem ipsum',
    },
    {
      user: 'User 12',
      date: new Date(),
      message: 'Lorem ipsum',
    },
    {
      user: 'User 3',
      date: new Date(),
      message: 'Lorem ipsum',
    },*/
    ],
  };


  //////////////////////////////////
  /// delete after thread form is finished /////////
  mockChannelData = {
    channelID: '',
    title: 'Ein toller Titel',
    creator: 'Aljoscha Schönfeld',
    creationDate: new Date(),
    info: 'Test Channel, nichts weiter.',
  };
  ////////////////////////////

  get authUser$() {
    return this.authService.getAuthCredentials();
  }
  get currentUserId$() {
    return this.usersService.currentUserId$;
  }
  get currentUserName$() {
    return this.usersService.currentUserName$;
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['']);
  }

  logAllUsers() {
    // this.firestore.getSpecificUser('hRUJ0L1r6lc9eRBgng1g0YMOFZp1')
    // this.firestore.getAllUsers();
    // this.usersService.updateUserFieldValue('lastName', 'Schönfeld');
    // console.log('change Field Value');
  }

  logChats() {
    this.firestore.addNewChat(this.mockChatData);
    // this.firestore.getSpecificChat('hnaMoTLKFwDYuvYjNgQN');
    // this.firestore.getAllChats();
    // this.firestore.addUserToChat('B6qjUoa1QtupHldw0Pf0','User 4');
    // this.firestore.addChatMessage('B6qjUoa1QtupHldw0Pf0','User 5','hey there!?$');
  }

  logThreads() {
    // this.firestore.addNewThread(this.mockThreadData);
    // this.firestore.getSpecificThread('9yuMwkxvzhfhM8QEn8qm');
    this.firestore.updateSpecificThread('2OwuPNOKF0m54z4AnPET','Lore fdsa dolor sit saffcing','JZqJhIAsqZbU4mw4gCfs00KdJHV2');
    // this.firestore.getAllThreads();
  }

  logFirebaseAuthCredentials() {
    this.authService.getAuthCredentials();
  }

  logChannels() {
    // this.firestore.addNewChannel('#MusterChannel4', this.mockChannelData);
    this.firestore.readChannels();
    // this.firestore.getSpecificChannel('#MusterChannel4');
    // this.firestore.getSpecificChannel('#gruppe-576');
  }

  logUserData() {
    this.usersService.getCurrentUserData();
    // this.usersService.updateUserFieldValue('city', 'Oyten')
  }

  openDialog() {
    this.dialog.open(DialogEditUserComponent, {
      // height: '350px',
      // width: '400px',
      // position: { right: '50px', top: '74px' },
      data: {
        // displayName: this.authUser$.displayName,
        // email: this.authUser$.email,
        // photoUrl: this.authUser$.photoURL,
        emailVerified: this.authUser$.emailVerified,
      },
    });
  }

  // loglocalStorage() {
  //   this.currentUserDisplayName = this.authService.getCurrentLocalUser();
  // }
}
