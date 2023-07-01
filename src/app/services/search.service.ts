import { EventEmitter, Injectable } from '@angular/core';
import { ChannelService } from './channel.service';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  activeChannel: any;
  activeChat: any;
  activeThread: any;
  activeUsers: any;
  activeComponent: any = 'Loading...';
  unfilteredThreads: any;
  filteredThreads: any;
  unfilteredUsers: any;
  filteredUsers: any;
  searchThreadsStatus: EventEmitter<boolean> = new EventEmitter<boolean>();
  searchUsersStatus: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(
    public channelService: ChannelService,
    public chatService: ChatService
  ) {}

  /**
   * search function for channel and chat
   * @param searchTerm - the search term of input field
   */
  searchingFunction(searchTerm: string) {
    if (this.activeChannel) {
      this.searchChannelThreads(
        searchTerm,
        this.channelService.unfilterdThreads
      );
    } else if (this.activeChat) {
      this.searchChatContent(
        searchTerm,
        this.chatService.unfilteredChatHistory
      );
    } else if (this.activeThread) {
      this.searchThreadsContent(searchTerm, this.unfilteredThreads);
      this.searchThreadsStatus.emit(true);
    } else if (this.activeUsers) {
      this.searchUsersContent(searchTerm, this.unfilteredUsers);
      this.searchUsersStatus.emit(true);
    }
  }

  /**
   * find the active component and set it to the activeComponent variable
   */
  findActiveComponent() {
    if (this.activeChannel) {
      this.activeComponent = 'Search #' + this.activeChannel.title;
    } else if (this.activeChat) {
      this.activeComponent = 'Search #' + this.activeChat;
    } else if (this.activeThread) {
      this.activeComponent = 'Search #' + this.activeThread;
    } else if (this.activeUsers) {
      this.activeComponent = 'Search #' + this.activeUsers;
    }
  }

  /**
   * search the channel threads for the search term
   * @param searchTerm - the search term of input field
   * @param threads - the threads from channel to search in
   */
  searchChannelThreads(searchTerm: string, threads: Array<any>) {
    searchTerm = searchTerm.toLowerCase();
    let filteredContent = threads.filter((thread) => {
      return (
        thread.user.name.toLowerCase().includes(searchTerm) ||
        thread.content.toLowerCase().includes(searchTerm)
      );
    });
    threads = filteredContent;
    this.channelService.updateChannelContent(threads);
  }

  /**
   * search the chat content for the search term
   * @param searchTerm - the search term of input field
   * @param chats - the chats from chat to search in
   */
  searchChatContent(searchTerm: string, chats: Array<any>) {
    searchTerm = searchTerm.toLowerCase();
    let filteredContent = chats.filter((chat) => {
      return (
        chat.user.name.toLowerCase().includes(searchTerm) ||
        chat.message.toLowerCase().includes(searchTerm)
      );
    });
    chats = filteredContent;
    this.chatService.updateChatContent(chats);
  }

  /**
   * search the threads content for the search term
   * @param searchTerm - the search term of input field
   * @param threads - the threads from threads-shortcut to search in
   */
  searchThreadsContent(searchTerm: string, threads: Array<any>) {
    searchTerm = searchTerm.toLowerCase();
    let filteredContent = threads.filter((thread) => {
      return thread.content.toLowerCase().includes(searchTerm);
    });
    this.filteredThreads = filteredContent;
  }

  /**
   * search the users for the search term
   * @param searchTerm - the search term of input field
   * @param threads - the users from users-shortcut to search in
   */
  searchUsersContent(searchTerm: string, users: Array<any>) {
    searchTerm = searchTerm.toLowerCase();
    let filteredContent = users.filter((user) => {
      return user.displayName.toLowerCase().includes(searchTerm);
    });
    this.filteredUsers = filteredContent;
  }
}
