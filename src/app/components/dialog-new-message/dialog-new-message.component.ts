import { Component, Inject, InjectionToken } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-new-message',
  templateUrl: './dialog-new-message.component.html',
  styleUrls: ['./dialog-new-message.component.scss'],
})
export class DialogNewMessageComponent {
  time = new Date();
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { user: string; image: string; email: string }
  ) {}
}
