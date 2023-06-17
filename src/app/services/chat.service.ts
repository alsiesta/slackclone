import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { Chat } from '../models/chat.class';
import { UsersService } from './users.service';
import { GlobalService } from './global.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  chat = new Chat();
  chatOpen: boolean = false;
  chatReady: boolean = false;
  chatList: Array<any> = [];
  userList: Array<any> = [];
  dateList: Array<any> = [];
  chatPartnerList: Array<any> = [];
  activeChatPartnerList: Array<any> = [];
  chatHistory: Array<any> = [];

  constructor(
    public firestoreService: FirestoreService,
    public userService: UsersService,
    public globalService: GlobalService
  ) {}

  /**
   * open the chat component and load the chat content
   * @param chatPartner - the user to open a chat with
   */
  async openChat(chatPartner: string) {
    await this.firestoreService.getAllChats().then(() => {
      this.chatList = this.firestoreService.chatList;
    });

    if (this.chatList.length > 0 && this.checkIfChatExists(chatPartner)) {
      this.openExistingChat();
    } else {
      this.addNewChat(chatPartner);
    }
    this.chatOpen = true;
    this.loadChatContent(chatPartner);
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
    await this.firestoreService.addNewChat(this.chat);
  }

  /**
   * open an existing chat with the chatPartner
   */
  openExistingChat() {}

  /**
   * load the chat content from firestore.service
   * @param chatPartner - the user to open a chat with
   */
  async loadChatContent(chatPartner: string) {
    this.chatReady = false;
    await this.firestoreService.getAllChats().then(() => {
      this.chatList = this.firestoreService.chatList;
    });
    await this.firestoreService.getAllUsers().then(() => {
      this.userList = this.firestoreService.usersList;
    });

    this.checkIfChatExists(chatPartner);
    this.setChatHistory();
    this.findDates();
    this.setUserInChatHistory(chatPartner);
    this.editChatPartnerList();
    this.chatReady = true;
  }

  /**
   * set the chat history from the chat object
   */
  setChatHistory() {
    this.chatHistory = [];
    this.chat.chat.forEach((element?: any) => {
      this.chatHistory.push(element);
    });
  }

  /**
   * find all dates in the chat history and sort them to a unique list
   */
  findDates() {
    this.dateList = [];
    this.chatHistory.forEach((element?: any) => {
      this.dateList.push(element.date);
    });
    this.dateList = this.globalService.uniqueList(this.dateList);
    this.dateList = this.globalService.sortingDateList(this.dateList);
  }

  /**
   * set the user data in the chat history
   */
  setUserInChatHistory(chatPartner: string) {
    if (this.chatHistory.length > 0) {
      this.chatHistory.forEach((chat: any) => {
        this.userList.forEach((user: any) => {
          if (chat.user === user.id) {
            this.chatPartnerList.push(chat.user);
            this.setUserDataInChat(chat, user);
          }
        });
      });
    } else {
      this.chatPartnerList.push(chatPartner);
    }
  }

  /**
   * set the user data in the chat object
   * @param chat - the chat object to set the user data in
   * @param user - the user object to get the data from
   */
  setUserDataInChat(chat: any, user: any) {
    chat.user = {
      id: user.id,
      name: user.displayName,
      image: user.photoURL
        ? user.photoURL
        : 'assets/img/threads/profile-picture.png',
      email: user.email,
    };
  }

  /**
   * edit the chat partner list to a unique list and remove the current user
   */
  editChatPartnerList() {
    this.chatPartnerList = this.globalService.uniqueList(this.chatPartnerList);
    this.chatPartnerList = this.chatPartnerList.filter(
      (user: any) => user !== this.userService.currentUserId$
    );

    this.chatPartnerList.forEach((user: any) => {
      this.userList.forEach((userList: any) => {
        if (user === userList.id) {
          this.setActiveChatPartnerList(userList);
        }
      });
    });
  }

  /**
   * push the user data in the active chat partner list
   * @param userList - the user object to set the data in the active chat partner list
   */
  setActiveChatPartnerList(userList: any) {
    this.activeChatPartnerList = [];
    let chatPartner = {
      id: userList.id,
      name: userList.displayName,
      image: userList.photoURL
        ? userList.photoURL
        : 'assets/img/threads/profile-picture.png',
      email: userList.email,
    };
    this.activeChatPartnerList.push(chatPartner);
  }
}
