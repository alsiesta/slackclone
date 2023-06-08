import {Component, Inject} from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {NgIf} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

export interface DialogData {
  displayName;
  email;
  photoUrl;
  emailVerified;
}

@Component({
  selector: 'app-dialog-edit-user',
  templateUrl: './dialog-edit-user.component.html',
  styleUrls: ['./dialog-edit-user.component.scss']
})
export class DialogEditUserComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}
