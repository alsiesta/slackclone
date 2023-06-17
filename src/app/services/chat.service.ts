import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Chat } from '../models/chat.class';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  chat = new Chat();
  chatOpen: boolean = false;
  chatList: Array<any>;

  // to be deleted
  chatPartnerImage = 'assets/img/threads/profile-picture.png';
  chatPartnerName = 'John Doe';
  chatDates: Array<any> = ['03.06.2023', '04.06.2023'];
  messages: Array<any> = [
    {
      user: 'John Doe',
      image: 'assets/img/threads/profile-picture.png',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      date: '04.06.2023',
    },
    {
      user: 'Maxi Muster',
      image: 'assets/img/threads/profile-picture.png',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      date: '04.06.2023',
    },
  ];

  constructor(
    public fireStoreService: FirestoreService,
    public userService: UsersService
  ) {}

  /**
   * open the chat component and load the chat content
   * @param chatPartner - the user to open a chat with
   */
  async openChat(chatPartner: string) {
    await this.fireStoreService.getAllChats().then(() => {
      this.chatList = this.fireStoreService.chatList;
    });

    if (this.chatList.length > 0 && this.checkIfChatExists(chatPartner)) {
      this.openExistingChat();
    } else {
      this.addNewChat(chatPartner);
    }
  }

  /**
   * check if a chat with the chatPartner already exists
   * @param chatPartner - the user to open a chat with
   * @returns - true if chat exists, false if not
   */
  checkIfChatExists(chatPartner: string) {
    for (let chat of this.chatList) {
      if (
        chat.chatUsers.includes(this.userService.currentUserId$) &&
        chat.chatUsers.includes(chatPartner)
      ) {
        this.chat = chat;
        return true;
      }
    }
    return false;
  }

  /**
   * add a new chat with the chatPartner and upload it to firestore
   * @param chatPartner - the user to open a chat with
   */
  async addNewChat(chatPartner: string) {
    this.chat = {
      chat: [],
      chatId: '',
      chatUsers: [this.userService.currentUserId$, chatPartner],
    };
    await this.fireStoreService.addNewChat(this.chat);
    this.chatOpen = true;
    console.log('new chat created', this.chat);
  }

  /**
   * open an existing chat with the chatPartner
   */
  openExistingChat() {
    this.chatOpen = true;
    console.log('open existing chat', this.chat);
  }
}
