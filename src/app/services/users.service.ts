import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';
import { doc, getDoc } from "firebase/firestore";

import { User } from '../models/user.class';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  currentUser$: User;

  constructor (private firestoreService: FirestoreService, private authService: AuthService) { }

  async logUserRef () {
    const docRef = this.firestoreService.getDocRef(this.authService.getUserId());
    const docSnap = await getDoc(docRef);
    this.currentUser$ = docSnap.data();
    console.log(docSnap.data());
    console.log(this.currentUser$.displayName);
    
  }

}
