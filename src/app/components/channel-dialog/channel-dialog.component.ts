import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ChannelService } from 'src/app/services/channel.service';

@Component({
  selector: 'app-channel-dialog',
  templateUrl: './channel-dialog.component.html',
  styleUrls: ['./channel-dialog.component.scss'],
})
export class ChannelDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ChannelDialogComponent>,
    public channelService: ChannelService
  ) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
