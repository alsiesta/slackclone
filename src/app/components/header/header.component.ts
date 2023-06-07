import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { DialogEditUserComponent } from '../dialog-edit-user/dialog-edit-user.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(
    public authService: AuthService,
    private router: Router,
    public usersService: UsersService,
    public firestore: FirestoreService,
    public dialog: MatDialog
  ) {}

  currentUserDisplayName: string | undefined;

  ngOnInit() {
    this.loglocalStorage();
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['']);
  }

  logAllUsers() {
    this.usersService.getAllUsers();
  }

  loglocalStorage() {
    this.currentUserDisplayName = this.authService.getCurrentLocalUser();
  }

  logFirebaseAuthCredentials() {
    this.authService.getAuthCredentials();
  }

  logChannels() {
    this.firestore.readChannels();
  }
  openDialog() {
    this.dialog.open(DialogEditUserComponent, {
      height: '350px',
      width: '350px',
      position: { right: '50px', top: '74px' },
      data: {
        animal: 'unicorn',
        displayName: this.currentUserDisplayName,
      },
    });
  }
}
