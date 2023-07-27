import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-reset-password',
  templateUrl: './dialog-reset-password.component.html',
  styleUrls: ['./dialog-reset-password.component.scss'],
})
export class DialogResetPasswordComponent {

  constructor (private authService: AuthService, public dialogRef: MatDialogRef<DialogResetPasswordComponent>) { }
  email: string = '';

  resetPassword () {
    this.authService.resetPassword(this.email);
    this.closeDialog();
  }

  closeDialog () {
    this.dialogRef.close(this.dialogRef);
  }
}

