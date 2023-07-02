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
import { SearchService } from 'src/app/services/search.service';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { GlobalService } from 'src/app/services/global.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public searchText: string;
  public icon = 'menu_open';

  constructor(
    public authService: AuthService,
    private router: Router,
    public usersService: UsersService,
    public firestore: FirestoreService,
    public dialog: MatDialog,
    public searchService: SearchService,
    private globalService: GlobalService,
  ) {}

  currentUserDisplayName: any;
  ngOnInit() {
    this.startSearchEvent();
    // this.loglocalStorage();
  }

  toggleSidebar() {
    this.globalService.toggleSidebar();
    this.icon = this.icon === 'menu_open' ? 'menu' : 'menu_open';
}

  /// delete from here  /////////
  mockChatData = {
    chatId: 'Muster Chat ID',
    chatUsers: ['User 1', 'User 2', 'User 3'],
    chat: [
      {
        user: 'User 1',
        date: new Date(),
        time: new Date(),
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
  /// till here  ///////////////////




  get authUser$() {
    return this.authService.getAuthCredentials();
  }
  get currentUserId$() {
    return this.usersService.currentUserId$;
  }
  get currentUserPhoto() {
    return this.usersService.currentUserPhoto;
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
    this.usersService.getAllUsers();
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
    // this.firestore.updateSpecificThread('2OwuPNOKF0m54z4AnPET','Lore fdsa dolor sit','JZqJhIAsqZbU4mw4gCfs00KdJHV2');
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
      panelClass: 'dialog-panel', // Aad a custom panel class
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

  /**
   * start search event after 1 second (to prevent errors)
   */
  startSearchEvent() {
    setTimeout(() => {
      const searchbar = document.getElementById('searchbar');
      searchbar.addEventListener('keyup', () => {
        this.searchingComponents(this.searchText);
      });
    }, 1000);
  }

  /**
   * search function for channel and chat
   * @param searchText - the search text from input field
   */
  searchingComponents(searchText: string) {
    this.searchService.searchingFunction(searchText);
  }
}
