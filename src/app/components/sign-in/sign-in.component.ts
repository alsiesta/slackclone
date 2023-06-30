import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private router: Router,
    private toast: HotToastService
  ) { }
  
  userCredentials;

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  async guestSignIn () {
    await this.authService.signIn('guest@d.de','123456');
    this.router.navigate(['/home']);
  }

  signInWithGoogle () {
    this.authService.signInWithGoogle();
  }
  
  logOut() {
    this.authService.logOut();
    this.router.navigate(['']);
  }

  async submit() {
    const { email, password } = this.loginForm.value; //destructure obj. first

    if (!this.loginForm.valid) {
      return;
    }
    try {
      await this.authService.signIn(email,password);
      this.router.navigate(['/home']);
      // this.toast.observe({
      //       success: 'Logged in successfully',
      //       loading: 'Logging in...',
      //       error:'There was an error'
      //     })
    } catch (error) {
      console.warn(error);
    }
  }


  // // via Observable
  // this.authService.login(email, password).pipe(
  //   this.toast.observe({
  //     success: 'Logged in successfully',
  //     loading: 'Logging in...',
  //     error:'There was an error'
  //   })
  // ).subscribe(() => {
  //   this.router.navigate(['/home']);
  // });
}
