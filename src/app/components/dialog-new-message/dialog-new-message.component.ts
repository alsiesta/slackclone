import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-dialog-new-message',
  templateUrl: './dialog-new-message.component.html',
  styleUrls: ['./dialog-new-message.component.scss'],
})
export class DialogNewMessageComponent {
  time = new Date();
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { user: string; image: string; email: string; id: string },
    public chatService: ChatService,
    public dialogRef: MatDialogRef<DialogNewMessageComponent>
  ) {}
}
