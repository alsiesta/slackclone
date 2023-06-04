import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';
import { doc, getDoc } from "firebase/firestore";

import { User } from '../models/user.class';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  currentUser$: User;
  currentUserData: any;

  constructor () { }

  getCurrentUserId() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user.uid);
      }
    });
  }

}
