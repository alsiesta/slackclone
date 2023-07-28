import { Component } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';
import { SearchService } from 'src/app/services/search.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-users-shortcut',
  templateUrl: './users-shortcut.component.html',
  styleUrls: ['./users-shortcut.component.scss']
})
export class UsersShortcutComponent {
  userList: any[];

  constructor(
    private usersService: UsersService,
    private channelService: ChannelService,
    public searchService: SearchService) {

    // Retrieve the user list from the usersService and deletes the currentUser from it.
    this.userList = this.usersService.currentUsers;
    this.searchService.unfilteredUsers = this.userList;
    let currentUser = this.usersService.currentUserId$;
    this.userList = this.userList.filter(user => user.uid !== currentUser);

    // Event listener for the search function
    this.searchService.searchUsersStatus.subscribe(status => {
      if (status) {
        this.updateUsersContent(this.searchService.filteredUsers);
      } else {
        this.updateUsersContent();
      }
    })
  }

  /**
   * Opens the DialogNewMessageComponent
   * 
   * @param displayName - string of the users displayname
   * @param photoURL - string of the users photoURL
   * @param email - string of the users email
   * @param uid - string of the users userid
   */
  openDialog(displayName, photoURL, email, uid) {
    this.channelService.messageDialogOpen(displayName, photoURL, email, uid)
  }

  /**
   * update the content of the users list when event is triggered
   * @param filteredUsers - the filtered users
   */
  updateUsersContent(filteredUsers?: any) {
    this.userList = this.usersService.currentUsers;
    this.searchService.unfilteredUsers = this.userList;
    let currentUser = this.usersService.currentUserId$;
    this.userList = this.userList.filter(user => user.uid !== currentUser);

    if (filteredUsers) {
      this.userList = filteredUsers;
    }
  }
}
