import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor (public authService: AuthService, private router: Router) { }
  
  logOut() {
    //logging out via promise
    this.authService.logOut();
    this.router.navigate(['']);
  }
}
