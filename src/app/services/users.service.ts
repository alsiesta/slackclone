import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';
import { doc, getDoc, onSnapshot, Firestore } from 'firebase/firestore';
import * as GLOBAL_VARS from 'src/app/shared/globals';
import { User } from '../models/user.class';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root',
})
export class UsersService {
  user = new User();
  currentUser$: User;
  $currentUserData: any;

  constructor(private firestoreService: FirestoreService) {}

  getCurrentUserId() {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user.uid);
      }
    });
  }

  getCurrentUserData() {
    this.$currentUserData = this.firestoreService.getDocData('V7yyPDgZtYepeluK89vlBHOPYIv1');

    this.$currentUserData.subscribe((response: any) => {
      this.user.birthDate = response.birthDate;
      this.user.city = response.city;
      this.user.displayName = response.displayName;
      this.user.email = response.email;
      this.user.firstName = response.firstName;
      this.user.lastName = response.lastName;
      this.user.password = response.password;
      this.user.street = response.birthstreetDate;
      this.user.uid = response.uid;
      this.user.zipCode = response.zipCod;
      console.log(this.user.toJSON());
      
    });
  }
}
