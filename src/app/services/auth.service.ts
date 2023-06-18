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
import { Channel } from '../models/channel.class';

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
  userId: string = '';
  channel: Channel = new Channel;

  /// delete after channel form is finished /////////
  date = new Date(); //mock date
  testChannel = {
  channelID: 'Muster Kanal', 
  title: 'Titel', 
  creator: 'Autor', 
  creationDate: this.date,
  info: 'Information', 
  }
  //////////////////////////////////

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
      photoURL: './assets/img/user/avatar3.png',
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
    //   console.log('DisplayName: ', displayName,' \nEmail: ', email,' \nphotoURL: ', photoURL,' \nEmail verified: ', emailVerified,' \nUID: ', uid);
    //  const authUser = [displayName,email,photoURL,emailVerified]
    //   return authUser;
      return user;
    } else {
      throw new Error('There is no authenticated user in Firestore!');
    }
  }

 

  logOut() {
    localStorage.removeItem('SlackUser');
    return this.auth.signOut();
  }
  
  
  // setLocalUser() {
  //   onAuthStateChanged(this.auth, (user) => {
  //     if (user) {
  //       this.userData = user;
  //       localStorage.setItem('SlackUser', JSON.stringify(this.userData));
  //       // JSON.parse(localStorage.getItem('SlackUser')!);
  //     } else {
  //       localStorage.setItem('SlackUser', 'null');
  //       // JSON.parse(localStorage.getItem('SlackUser')!);
  //     }
  //   });
  // }

  // getCurrentLocalUser() {
  //   const user = JSON.parse(localStorage.getItem('SlackUser')!);
  //   if (user) {
  //     console.log('Authenticated User in local storage: ', user);
  //     return user.displayName;
  //   } else {
  //     console.log('No user in local storage');
  //   }
  // }
}
