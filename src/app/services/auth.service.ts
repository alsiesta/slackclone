import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { FirestoreService } from './firestore.service';
import { User } from '../models/user.class';
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
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private firestoreService: FirestoreService,
    private auth: Auth,
    private toast: HotToastService
  ) {
    // connectAuthEmulator(auth, 'http://localhost:9099'); //emmulating fire auth on local mashine
  }
  currentUser$ = authState(this.auth);
  loading: boolean = false;
  user = new User();

  ngOnInit() {
    console.log(this.currentUser$);
  }

  signUp = async (email: string, password: string, name: any) => {
    const userCredentials = await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    ).then((userCredentials) => {
      // const uid = userCredentials.providerId;
      this.firestoreService.addNewUser(
        userCredentials.user.uid,
        name,
        email,
        password
      );
    });
    this.toast.info(`Hi ${name}. Your were successfully signed up`);

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
        this.currentUser$.subscribe((user) => {
          console.log('Current User is: ', user?.displayName);
        });

        this.toast.info(
          `Hi ${userCredentials.user.displayName}! You are signed in.`
        );
        this.logUserDetails(userCredentials);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });

    return userCredentials;
  };

  logOut() {
    return this.auth.signOut();
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

  isUserLoggedIn() {
    return true;
  }
}
