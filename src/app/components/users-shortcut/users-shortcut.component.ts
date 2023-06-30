import { Component } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';
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
  ) {
    // Retrieve the user list from the usersService and deletes the currentUser from it.
    this.userList = this.usersService.currentUsers;
    let currentUser = this.usersService.currentUserId$;
    this.userList = this.userList.filter(user => user.uid !== currentUser);
  }

  openDialog(displayName, photoURL, email, uid) {
    this.channelService.messageDialogOpen(displayName, photoURL, email, uid)
  }
  
}
