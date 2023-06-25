import { Injectable } from '@angular/core';
import { ChannelService } from './channel.service';
import { ChatService } from './chat.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  activeChannel: any;
  activeChat: any;
  activeComponent: any = 'Loading...';

  constructor(
    public channelService: ChannelService,
    public chatService: ChatService
  ) {}

  /**
   * search function for channel and chat
   * @param searchTerm - the search term of input field
   */
  searchingFunction(searchTerm: string) {
    console.log(searchTerm);
  }

  /**
   * find the active component and set it to the activeComponent variable
   */
  findActiveComponent() {
    if (this.activeChannel) {
      this.activeComponent = 'Search channel #' + this.activeChannel.title;
    } else {
      this.activeComponent = 'Search #' + this.activeChat;
    }
  }
}
