import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(
    public authService: AuthService,
    private router: Router,
    public usersService: UsersService
  ) {}
  displayName: string;

  logOut() {
    this.authService.logOut();
    this.router.navigate(['']);
  }

  logUserId() {this.usersService.logUserId()}
 
  logAllUsers(){this.usersService.getAllUsers()}
  logCurrentUserData(){this.usersService.getCurrentUserData()}

}
