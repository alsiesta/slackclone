import { Component, OnInit } from '@angular/core';
import { Channel } from 'src/app/models/channel.class';
import { FirestoreService } from 'src/app/services/firestore.service';
import { ChannelService } from 'src/app/services/channel.service';
import { DialogCreateNewChannelComponent } from '../dialog-create-new-channel/dialog-create-new-channel.component';
import { MatDialog } from '@angular/material/dialog';
import { Thread } from 'src/app/models/thread.class';
import { UserTemplate } from 'src/app/models/usertemplate.class';
import { UsersService } from 'src/app/services/users.service';
import {  User } from 'firebase/auth';
import { Chat } from 'src/app/models/chat.class';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/services/chat.service';
import { DialogCreateNewChatComponent } from '../dialog-create-new-chat/dialog-create-new-chat.component';




@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  channelsAreOpen = true;
  directmessagesAreOpen = true;
  observerChannelList: Observable<any>;
  channels: Channel[] = [];
  chats: any;

  threads: Thread[] = [];
  allUsers: UserTemplate[] = [];
  currentUser: User[] = [];
  allChats: Chat[] = [];
  userId$: any;

  constructor(private firestoreService: FirestoreService,
    private channelService: ChannelService,
    private chatService: ChatService,
    private usersService: UsersService,
    public createChannelDialog: MatDialog,
    ) 
    {}

  ngOnInit () {
    this.firestoreService.getChannelList().subscribe((channels) => {
      this.channels = channels;
    });
    this.chatService.loadPersonalChatList(this.usersService.currentUserId$).then(() => {
      this.chats = this.chatService.personalChatList;
    });
    console.log('Chats', this.chats);
  }

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

  openCreateChannelDialog() {
    this.createChannelDialog.open(DialogCreateNewChannelComponent, {
      maxWidth: '100vw',
    });
  }

  openCreateChatDialog() {
    this.createChannelDialog.open(DialogCreateNewChatComponent, {
      maxWidth: '100vw',
    });
  }

  renderChannel(channel) {
    this.channelService.loadChannelContent(channel.id);
  }

}