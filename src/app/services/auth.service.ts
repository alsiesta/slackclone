import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import {
  Auth,
  UserCredential,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  connectAuthEmulator,
  updateProfile,
  getAuth,
  user,
  onAuthStateChanged,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth, private toast: HotToastService, ) {
    // connectAuthEmulator(auth, 'http://localhost:9099'); //emmulating fire auth on local mashine
  }
  currentUser$ = authState(this.auth);

  ngOnInit() {
    console.log(this.currentUser$);
  }

  signUp = async (email: string, password: string, name: any) => {
    const userCredentials = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    ).then((userCredentials) => {
      console.log('Dieses sind sie: ', userCredentials);
      console.log('Name ist: ', name);
    });
    this.toast.info('Your were successfully signed up');

    return userCredentials;
  };

  signIn = async (email: string, password: string) => {
    const userCredentials = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    )
      
        // this.toast.info(`Hi ${userCredentials.user.displayName}! You are signed in.`);
        // this.logUserDetails(userCredentials);
    
      .then((userCredentials) => {
       this.currentUser$.subscribe((user => {
          console.log('Current User is: ', user?.displayName);
          
        }))
        
        this.toast.info(`Hi ${userCredentials.user.displayName}! You are signed in.`);
        this.logUserDetails(userCredentials);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });

    return userCredentials;
  };

  logOut() {
    return this.auth.signOut(); //logging out via promise
  }

  monitorAuthState = async () => {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        const uid = user.uid;
        return user;
      } else {
        return null;
      }
    });
  };

  logUserDetails(userCredentials: UserCredential) {
    console.log('Current User ID: ', userCredentials.user.uid);
    console.log('Current User DisplayName: ', userCredentials.user.displayName);
    console.log('Current User Email: ', userCredentials.user.email);
    console.log('Email verified?: ', userCredentials.user.emailVerified);
  }


  isUserLoggedIn () {
    return true;
  }
}
