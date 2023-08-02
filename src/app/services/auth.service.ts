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
import {
  AuthProvider,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { UserTemplate } from '../models/usertemplate.class';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userData: import('@angular/fire/auth').User;
  constructor(
    private firestoreService: FirestoreService,
    private auth: Auth,
    private toast: HotToastService,
    private router: Router
  ) {}

  user = new UserTemplate();
  loading: boolean = false;
  channel: Channel = new Channel();
  isUserLoggedIn: boolean = false;
  userCredentials; // used for google sign in
  providerGoogle = new GoogleAuthProvider();
  providerFacebook = new FacebookAuthProvider();
  providerTwitter = new TwitterAuthProvider();
  providerGithub = new GithubAuthProvider();

  /**
   * This method is used to sign up a new user. It creates a new user in the authentication service
   * and adds the user to the users collection in Firestore. It also updates the displayName of the
   * user in the authentication service.
   * @param email 
   * @param password 
   * @param name 
   */
  signUp = async (email: string, password: string, name: any) => {
    try {
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
      this.router.navigate(['/home']);
    } catch (err) {
      this.toast.error(err.message);
    }
  };


  /**
   * This method is used to sign in a user. It signs in the user in the authentication service.
   * It also sets the isUserLoggedIn property to true. If the sign in fails, it sets the isUserLoggedIn
   * property to false.
   * @param email 
   * @param password 
   * @returns 
   */
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
      .catch((signInError) => {
        const errorCode = signInError.code;
        const errorMessage = signInError.message;
        console.log('Sign-in error', errorCode, errorMessage);
        this.toast.error(this.getErrorMessage(errorCode));
        this.isUserLoggedIn = false;
      });

    return userCredentials;
  };


  /**
   * Regular expression for email validation
   * @param errorCode 
   * @returns 
   */
  getErrorMessage = (errorCode: string) => {
    if (errorCode === 'auth/user-not-found') {
      return `Sorry. This user doesn't exist. Permission denied.`;
    } else if (errorCode === 'auth/wrong-password') {
      return `Sorry. This password is wrong. Permission denied.`;
    } else {
      return `Sorry. Something went wrong. Permission denied.`;
    }
  };


  /**
   * Allows the user to sign in with Google. It uses the signInWithPopup method from the authentication
   * service. It also sets the isUserLoggedIn property to true. If the sign in fails, it sets the isUserLoggedIn
   * property to false.
   * @returns 
   */
  async signInWithGoogle(): Promise<any> {
    const user = await this.signInWithPopup(this.providerGoogle);
    return user;
  }

  /**
   * Userd by signInWithGoogle() 
   * @param provider 
   * @returns 
   */
  async signInWithPopup(provider: AuthProvider): Promise<any> {
    const auth = getAuth();
    let providerUser;
    // Sign in with popup: is not recommended for mobile devices
    await signInWithPopup(auth, provider).then(
      (result) => {
        this.router.navigate(['/home']);
        providerUser = this.onSuccess(result);
      },
      (error) => {
        this.toast.error(error.message);
      }
    );

    return providerUser;
  }

  /**
   * Updates the user object with the data from the authentication service. It also sets the isUserLoggedIn
   * property to true.
   * @param result 
   * @returns 
   */
  onSuccess(result: any) {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    const user = result.user;
    this.user.displayName = user.displayName;
    this.user.email = user.email;
    this.user.photoURL = user.photoURL;
    this.toast.info(`Hi ${user.displayName}! You are signed in.`);
    this.isUserLoggedIn = true;
    return user;
  }

  /**
   * Method sends a password reset email to the user.
   * @param email 
   */
  resetPassword(email: string) {
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        this.toast.info(`Password reset email sent to ${email}`);
      })
      .catch((error) => {
        this.toast.error(error.message);
      });
  }

/**
 * Updates the displayName of the user in the authentication service.
 * @param dName 
 */
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

  /**
   * Updates the photoURL of the user in the authentication service.
   * @param photoName 
   */
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

  /**
   * Gets the authenticated user from the authentication service.
   * @returns 
   */
  getAuthCredentials() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user !== null) {
      return user;
    } else {
      throw new Error('There is no authenticated user in Firestore!');
    }
  }

  logOut() {
    return this.auth.signOut();
  }

  /**
   * reauth user if user is logged in on page reload
   */
  reauthUser(): void {
    const unsubscribe = this.auth.onAuthStateChanged((user) => {
      if (user) {
        this.isUserLoggedIn = true;
        this.router.navigate(['/home']);
      }
    });
    unsubscribe();
  }
}
