import { Injectable } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { FirestoreService } from './firestore.service';
import { Router } from '@angular/router';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  TwitterAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from '@angular/fire/auth';
import { Channel } from '../models/channel.class';
import { UsersService } from './users.service';
import { getAdditionalUserInfo } from 'firebase/auth';
import { UserTemplate } from '../models/usertemplate.class';

// import { GoogleAuthProvider } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: import('@angular/fire/auth').User;
  constructor (
    private firestoreService: FirestoreService,
    private auth: Auth,
    private toast: HotToastService,
    private router: Router,
    private usersService : UsersService,
    private googleAuthProvider: GoogleAuthProvider
  ) { }
  
  user = new UserTemplate();
  loading: boolean = false;
  channel: Channel = new Channel();
  isUserLoggedIn: boolean = false;
  userCredentials; // used for google sign in
  providerGoogle = new GoogleAuthProvider();
  providerFacebook = new FacebookAuthProvider();
  providerTwitter = new TwitterAuthProvider();
  providerGithub = new GithubAuthProvider();

  // /// delete after channel form is finished /////////
  // date = new Date(); //mock date
  // testChannel = {
  //   channelID: 'Muster Kanal',
  //   title: 'Titel',
  //   creator: 'Autor',
  //   creationDate: this.date,
  //   info: 'Information',
  // };
  // //////////////////////////////////

  signUp = async (email: string, password: string, name: any) => {
    await createUserWithEmailAndPassword(this.auth, email, password).then(
      (userCredentials) => {
        this.firestoreService.addNewUser(
          userCredentials.user.uid,
          name,
          email,
          password
        );
        this.updateAuthdisplayName(name);
      }
    );
    this.toast.info(`Hi ${name}. Your were successfully signed up`);
    this.isUserLoggedIn = true;
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
        this.isUserLoggedIn = true;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log('Sign-in error', errorCode, errorMessage);
        this.toast.error(`Sorry. This user doesn't exist. Permission denied.`);
        this.isUserLoggedIn = false;
      });

    return userCredentials;
  };

  async signInWithGoogle (): Promise<any> {
    const auth = getAuth();
    const provider = new GoogleAuthProvider(); // needed for redirect only
    let providerUser;
    // Sign in with popup: is not recommended for mobile devices
    await signInWithPopup(auth, this.providerGoogle)
      .then((result) => {
        this.router.navigate(['/home']);
        localStorage.setItem('SlackUser', JSON.stringify(result.user?.uid));

        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        this.user.displayName = user.displayName;
        this.user.email = user.email;
        this.user.photoURL = user.photoURL;

        
        this.toast.info(`Hi ${user.displayName}! You are signed in.`);
        this.isUserLoggedIn = true;
        providerUser = user;
      },
      (error) => {
        console.log(error.message);
      });
      
      return providerUser;
  


    // Note when going into production, you should check that the redirect URL matches the one you specified when you enabled the sign-in method.
    // Sign in with redirect: is recommended for mobile devices
    // When you use signInWithRedirect, the sign-in flow is completed on a separate page and then returns to your page.
    // as soon as we have a solution for the redirect, we can use it

    // try {
    //   await signInWithRedirect(auth, provider);
    //   debugger;
    //   const result = await getRedirectResult(auth);
    //   console.log('Google Sign-In 1');
    //   // This gives you a Google Access Token. You can use it to access Google APIs.
    //   const credential = GoogleAuthProvider.credentialFromResult(result);
    //   const token = credential.accessToken;

    //   // The signed-in user info.
    //   const user = result.user;
    //   this.toast.info(`Hi ${user.displayName}! You are signed in.`);
    //   this.isUserLoggedIn = true;
    //   console.log('Google Sign-In 2');
    //   this.router.navigate(['/home']);
    //   console.log('Google Sign-In 3');
    // } catch (error) {
    //   // Handle Errors here.
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    //   // The email of the user's account used.
    //   const email = error.customData.email;
    //   // The AuthCredential type that was used.
    //   const credential = GoogleAuthProvider.credentialFromError(error);
    //   // ...
    // }
  }

  updateAuthdisplayName(dName) {
    console.log('update Profile DisplayName');
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      displayName: dName,
    })
      .then(() => {
        console.log(auth.currentUser);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  updateAuthPhoto(photoName) {
    console.log('update ProfilePhoto');
    const auth = getAuth();
    updateProfile(auth.currentUser, {
      photoURL: photoName,
    })
      .then(() => {
        console.log(auth.currentUser);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  getAuthCredentials() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user !== null) {
      // The user object has basic properties such as display name, email, etc.
      // const displayName = user.displayName;
      // const email = user.email;
      // const photoURL = user.photoURL;
      // const emailVerified = user.emailVerified;

      // // The user's ID, unique to the Firebase project. Do NOT use
      // // this value to authenticate with your backend server, if
      // // you have one. Use User.getToken() instead.
      // const uid = user.uid;
      // //   console.log('DisplayName: ', displayName,' \nEmail: ', email,' \nphotoURL: ', photoURL,' \nEmail verified: ', emailVerified,' \nUID: ', uid);
      // //  const authUser = [displayName,email,photoURL,emailVerified]

      return user;
    } else {
      throw new Error('There is no authenticated user in Firestore!');
    }
  }

  logOut() {
    localStorage.removeItem('SlackUser');
    return this.auth.signOut();
  }
}
