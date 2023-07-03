import { Component } from '@angular/core';
import { Channel } from '../../models/channel.class';
import { UsersService } from 'src/app/services/users.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-dialog-create-new-channel',
  templateUrl: './dialog-create-new-channel.component.html',
  styleUrls: ['./dialog-create-new-channel.component.scss'],
})
export class DialogCreateNewChannelComponent {
  channelName: string = '';

  constructor(
    private usersService: UsersService,
    private firestoreService: FirestoreService,
    private dialogRef: MatDialogRef<DialogCreateNewChannelComponent>
  ) {}

  /**
   * creates a new channel class and added it to firestore.
   * Title and ID is the input from the inputfield and creator is the current User.
   */
  createChannel() {
    let channel = new Channel();
    channel.channelID = this.channelName;
    channel.title = this.channelName;
    channel.creator = this.usersService.currentUserId$;

    this.firestoreService.addNewChannel(this.channelName, channel);
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
