import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';
import { UsersService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(
    public authService: AuthService,
    private router: Router,
    private usersService: UsersService
  ) {}

  title = 'SlackClone';

  ngOnInit() {
    this.usersService.keepUsersUptodate();
    this.authService.reauthUser();
  }
  
  logOut() {
    this.authService.logOut();
    this.router.navigate(['']);
  }
}
