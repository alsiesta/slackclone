import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from '../../services/firestore.service';
import { UsersService } from 'src/app/services/users.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { getDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(
    public authService: AuthService,
    private router: Router,
    private firestoreService: FirestoreService,
    public usersService: UsersService
  ) {}
  displayName: string;

  logOut() {
    //logging out via promise
    this.authService.logOut();
    this.router.navigate(['']);
  }

  logUserId() {
    // return this.usersService.logUserRef();
    return this.usersService.getCurrentUserId();
  }

  logUserData () {
   return this.usersService.getCurrentUserData()
    // return this.usersService.getCurrentUserData()
  }
}
