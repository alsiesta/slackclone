import { Component, OnInit } from '@angular/core';
import { Channel } from 'src/app/models/channel.class';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ChannelService } from 'src/app/services/channel.service';
import { DialogCreateNewChannelComponent } from '../dialog-create-new-channel/dialog-create-new-channel.component';
import { MatDialog } from '@angular/material/dialog';
import { Thread } from 'src/app/models/thread.class';
import { UserTemplate } from 'src/app/models/usertemplate.class';
import { UsersService } from 'src/app/services/users.service';
import { User } from 'firebase/auth';
import { Chat } from 'src/app/models/chat.class';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { DialogCreateNewChatComponent } from '../dialog-create-new-chat/dialog-create-new-chat.component';
import { GlobalService } from 'src/app/services/global.service';
import { SearchService } from 'src/app/services/search.service';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { MatDrawerMode } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  channelsAreOpen = true;
  directmessagesAreOpen = true;
  observerChannelList: Observable<any>;
  channels: Channel[] = [];
  chats: Chat[] = [];
  chatPartners: UserTemplate[] = [];
  drawerMode: MatDrawerMode;
  responsiveSidebar: boolean = false;

  shortcuts = [
    { label: 'Threads', isActive: false },
    { label: 'Users', isActive: false },
  ];

  constructor(
    private firestoreService: FirestoreService,
    private channelService: ChannelService,
    private chatService: ChatService,
    private usersService: UsersService,
    public createChannelDialog: MatDialog,
    public globalService: GlobalService,
    public searchService: SearchService,
    private breakpointObserver: BreakpointObserver,
  ) { }

  async ngOnInit() {
    this.breakPointObserving();

    await this.getChannelsFromFirestore();
    await this.getChatsFromFirestore();
    this.resetAllActiveStates();
    this.globalService.openComponent('channel');
    await this.channelService.loadChannelContent();
  }

  /**
   * when the breakpoint for responive sidebar is reached it toogles the sidebar to close, else it stays open
   * 
   */
  checkSidebarClosing() {
    if(this.responsiveSidebar) {
      this.toggleSidebar();
    }
  }

  /**
   * toggles the droppdown menu for channels and directmessages in the sidebar
   * 
   */
  toggleDropdown(key) {
    switch (key) {
      case 'ch':
        this.channelsAreOpen = !this.channelsAreOpen;
        break;

      case 'dm':
        this.directmessagesAreOpen = !this.directmessagesAreOpen;
        break;

      default:
        break;
    }
  }

  /**
   * opens the dialog to create a new channel
   * 
   */
  openCreateChannelDialog() {
    this.createChannelDialog.open(DialogCreateNewChannelComponent, {
      maxWidth: '100vw',
    });
  }

  /**
   * opens the dialog to create a new chat
   * 
   */
  openCreateChatDialog() {
    this.createChannelDialog.open(DialogCreateNewChatComponent, {
      maxWidth: '100vw',
    });
  }

  /**
   * renders the channel componend based on the channel id
   * 
   */
  async renderChannel(channel) {
    this.resetAllActiveStates();
    channel.isActive = true;
    await this.channelService.loadChannelContent(channel.channelID);
    this.globalService.openComponent('channel');
  }

  /**
   * renders the chat componend based on the chatPartner id
   * 
   */
  async renderChat(chatPartner) {
    this.resetAllActiveStates();
    chatPartner.isActive = true;
    this.setSearchFunction('chat');
    await this.chatService.openChat(chatPartner.uid);
    this.globalService.openComponent('chat');
  }

  /**
   * renders the users shortcut componend
   * 
   */
  renderUsers() {
    this.resetAllActiveStates();
    this.shortcuts[1].isActive = true;
    this.setSearchFunction('users');
    this.globalService.openComponent('usersShortcut');
  }

  /**
   * renders the thread shortcut componend
   * 
   */
  renderThreadShortcuts() {
    this.resetAllActiveStates();
    this.shortcuts[0].isActive = true;
    this.setSearchFunction('threads');
    this.globalService.openComponent('threadsShortcut');
  }

  /**
   * set the active component for the search function
   * @param component - the component to search in
   */
  setSearchFunction(component: string) {
    this.searchService.activeChannel = '';
    this.searchService.activeChat = '';
    this.searchService.activeThread = '';
    this.searchService.activeUsers = '';

    switch (component) {
      case 'chat':
        this.searchService.activeChat = 'chat';
        break;
      case 'users':
        this.searchService.activeUsers = 'users';
        break;
      case 'threads':
        this.searchService.activeThread = 'threads';
        break;
      default:
        break;
    }
    this.searchService.findActiveComponent();
  }

  /**
   * toggles the sidebar
   * 
   */
  toggleSidebar() {
    this.globalService.toggleSidebar();
  }


  /**
   * Handels when the sidebar is displayed on the side or is overlaping or filling fullscreen
   * 
   */
  breakPointObserving() {
    const customMaxBreakpoint = '(max-width: 768px)'; // Breite bis zu der Sidebar mode over ausgeführt wird

    this.breakpointObserver.observe([customMaxBreakpoint])
      .subscribe((state: BreakpointState) => {
        this.drawerMode = state.matches ? 'over' : 'side';
        this.responsiveSidebar = state.matches ? true : false;
        if(!this.globalService.isSidebarOpen$) {
          this.toggleSidebar();
        }
      });
  }

  /**
   * Subscribs to the channels from the channellist at the firestore service and activates the default.
   * 
   */
  getChannelsFromFirestore() {
    this.firestoreService.getChannelList().subscribe((channels) => {
      this.channels = channels;
      this.channels.forEach( channel => {
        if(channel.title == this.channelService.defaultChannelId)
          channel.isActive = true;
      })
    });
  }

  /**
   * Filters and subscribs to the chats from the chatlist at the firestore service
   * 
   */
  getChatsFromFirestore() {
    this.firestoreService.getChatList().subscribe((chats) => {
      const uniqueUserIds = new Set<string>();
      this.chats = chats.filter(
        (chat) =>
          chat.chatUsers[0] === this.usersService.currentUserId$ ||
          chat.chatUsers[1] === this.usersService.currentUserId$
      );
      this.chatPartners = [];
      const getUserPromises = []; // array for async promises
      this.chats.forEach((chat) => {
        chat.chatUsers.forEach((user) => {
          if (
            user !== this.usersService.currentUserId$ &&
            !uniqueUserIds.has(user)
          ) {
            uniqueUserIds.add(user);
            const promise = new Promise((resolve, reject) => {
              this.usersService.getUserById$(user).subscribe(
                (userData) => {
                  resolve(userData); // resolve userData, if there are resived
                },
                (error) => {
                  reject(error); // resolve error, if an error happens
                }
              );
            });
            getUserPromises.push(promise); // add promis to array
          }
        });
      });

      Promise.all(getUserPromises)
        .then((userDatas) => {
          userDatas.forEach((userData) => {
            this.chatPartners.push(userData); // userData added to chatPartners Array
          });
        })
        .catch((error) => {
        });
    });
  }

  /**
   * Sets all states of shortcuts, channels and chatPartners to false.
   * 
   */
  resetAllActiveStates(): void {
    this.shortcuts.forEach(item => item.isActive = false);
    this.channels.forEach(channel => channel.isActive = false);
    this.chatPartners.forEach(chatPartner => chatPartner.isActive = false);
  }


}
