import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router) {}

  title = 'SlackClone';

  logOut() {
    //logging out via promise
    this.authService.logOut();
    this.router.navigate(['']);
  }
}
