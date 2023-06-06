import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { FirestoreService } from './firestore.service';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  User,
  getAuth,
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
  ) {}

  loading: boolean = false;
  user: User;
  userId;

  signUp = async (email: string, password: string, name: any) => {
    await createUserWithEmailAndPassword(this.auth, email, password).then(
      (userCredentials) => {
        this.userId = userCredentials.user.uid;
        this.firestoreService.addNewUser(
          userCredentials.user.uid,
          name,
          email,
          password
        );
        this.setLocalUser();
        this.updateAuthCredentials(name);
      }
    );
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

  updateAuthCredentials(dName) {
    console.log('update Profile Name');
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: dName,
      photoURL: 'https://example.com/jane-q-user/profile.jpg',
    })
      .then(() => {
        console.log(auth.currentUser);
      })
      .catch((error) => {
        console.error(error)
      });
  }

  getAuthCredentials() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user !== null) {
      // The user object has basic properties such as display name, email, etc.
      const displayName = user.displayName;
      const email = user.email;
      const photoURL = user.photoURL;
      const emailVerified = user.emailVerified;

      // The user's ID, unique to the Firebase project. Do NOT use
      // this value to authenticate with your backend server, if
      // you have one. Use User.getToken() instead.
      const uid = user.uid;
      console.log(displayName, email, photoURL,emailVerified, uid);
    }
  }

  setLocalUser() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.userData = user;
        localStorage.setItem('SlackUser', JSON.stringify(this.userData));
        // JSON.parse(localStorage.getItem('SlackUser')!);
      } else {
        localStorage.setItem('SlackUser', 'null');
        // JSON.parse(localStorage.getItem('SlackUser')!);
      }
    });
  }

  getCurrentLocalUser() {
    const user = JSON.parse(localStorage.getItem('SlackUser')!);
    if (user) {
      console.log('Authenticated User in local storage: ', user);
      return user.displayName;
    } else {
      console.log('No user in local storage');
    }
  }

  logOut() {
    localStorage.removeItem('SlackUser');
    return this.auth.signOut();
  }
}
