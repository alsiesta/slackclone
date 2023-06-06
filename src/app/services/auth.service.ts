import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { FirestoreService } from './firestore.service';
import { UserTemplate } from '../models/usertemplate.class';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
  
export class AuthService {
  userData: import('@angular/fire/auth').User;
  constructor(
    private firestoreService: FirestoreService,
    private auth: Auth,
    private toast: HotToastService
  ) { }
  
  loading: boolean = false;
  user = new UserTemplate();
  userId;

  signUp = async (email: string, password: string, name: any) => {
    await createUserWithEmailAndPassword(
      this.auth,
      email,
      password
    ).then((userCredentials) => {
      this.userId = userCredentials.user.uid;
      this.firestoreService.addNewUser(
        userCredentials.user.uid,
        name,
        email,
        password
      );
      this.setLocalUser();
    });
    this.toast.info(`Hi ${name}. Your were successfully signed up`);
  };

  signIn = async (email: string, password: string) => {
    const userCredentials = await signInWithEmailAndPassword(
      this.auth,
      email,
      password
    )
      .then((userCredentials) => {
        this.setLocalUser();
        this.toast.info(
          `Hi ${userCredentials.user.displayName}! You are signed in.`
        );
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Sign-in error', errorCode, errorMessage);
      });

    return userCredentials;
  };

  setLocalUser () {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('SlackUser', JSON.stringify(this.userData));
        JSON.parse(localStorage.getItem('user')!);
      } else {
        localStorage.setItem('SlackUser', 'null');
        JSON.parse(localStorage.getItem('SlackUser')!);
      }
    });
  }

  logOut() {
    localStorage.removeItem('SlackUser');
    return this.auth.signOut();
  }

}
