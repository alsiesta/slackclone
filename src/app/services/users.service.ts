import { Injectable, OnInit } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';
import * as GLOBAL_VARS from 'src/app/shared/globals';
import { User } from '../models/user.class';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { BehaviorSubject, from } from 'rxjs';
import { collection, Firestore, collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private firestoreService: FirestoreService, private firestore: Firestore) {}
  currenUserId;
  currentUsers: any;
  currentUser$: User;
  $currentUserData: any;
  user = new User();

  public usersCollListener = new BehaviorSubject<any>({ users: [] });

  keepUsersUptodate() {
    const usersCollection = collection(this.firestore, GLOBAL_VARS.USERS);
    const users$ = collectionData(usersCollection, { idField: 'uid' });
    users$.subscribe((_users) => {
      this.usersCollListener.next({ users: _users });
      console.log(_users);
      this.currentUsers = _users;
    });
  }

  logUserId() {
    return this.getCurrentUserId();
  }

  getAllUsers () {
    console.log(this.currentUsers)
  }

  logUserData() {
    return this.getCurrentUserData();
  }

  async getCurrentUserId() {
    const auth = getAuth();
    await onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user.uid);
        this.currenUserId = user.uid;
        return user.uid;
      } else {
        return null;
      }
    });
  }

  getCurrentUserData() {
    const id = from(this.getCurrentUserId());
    id.subscribe((value) => {
      this.currenUserId = value;
      console.log(this.currenUserId);
    });

    this.$currentUserData = this.firestoreService.getDocData(this.currenUserId);

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
