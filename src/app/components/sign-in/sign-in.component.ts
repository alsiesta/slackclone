import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { UsersService } from 'src/app/services/users.service';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogResetPasswordComponent } from '../dialog-reset-password/dialog-reset-password.component';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  private dialogRef: MatDialogRef<any>;

  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private router: Router,
    public dialog: MatDialog
  ) {}

  userCredentials;
  get authUser$() {
    return this.authService.getAuthCredentials();
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  async guestSignIn() {
    await this.authService.signIn('bruce@wayne-enterprise.com', '123456');
    this.router.navigate(['/home']);
  }

  async signInWithGoogle() {
    this.userService.currentUserData$ =
      await this.authService.signInWithGoogle();
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['']);
  }

  /**
   * open dialog for resetting a password
   */
  openDialog($event) {
    $event.preventDefault();
    const dialogRef = this.dialog.open(DialogResetPasswordComponent, {
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(`Dialog result: ${result}`);
    });
  }

  async submit() {
    const { email, password } = this.loginForm.value; //destructure obj. first

    if (!this.loginForm.valid) {
      return;
    }
    try {
      await this.authService.signIn(email, password);
      this.router.navigate(['/home']);
    } catch (error) {
      console.warn(error);
    }
  }

}
