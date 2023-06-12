import { Injectable, OnInit } from '@angular/core';
import { FirestoreService } from './firestore.service';
import * as GLOBAL_VARS from 'src/app/shared/globals';
import { UserTemplate } from '../models/usertemplate.class';
import { Auth, getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { BehaviorSubject, Observable, from, map, switchMap } from 'rxjs';
import {
  collection,
  Firestore,
  collectionData,
  doc,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UsersService  {
  constructor(
    private firestoreService: FirestoreService,
    private firestore: Firestore,
    private auth: Auth
  ) {
    this.getCurrentUserId();
  }


  usersCollection = collection(this.firestore, GLOBAL_VARS.USERS);
  public usersCollListener = new BehaviorSubject<any>({ users: [] });

  currentUserId$: any;
  currentUserName$: any;
  currentUserData$: any;
  currentUsers: any;
  fsUser = new UserTemplate();

  keepUsersUptodate() {
    // const usersCollection = collection(this.firestore, GLOBAL_VARS.USERS);
    const users$ = collectionData(this.usersCollection, { idField: 'uid' });
    users$.subscribe((_users) => {
      this.usersCollListener.next({ users: _users });
      console.log(_users);
      this.currentUsers = _users;
    });
  }

  getAllUsers() {
    console.log(this.currentUsers);
  }

  getCurrentUserId() {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserId$ = user.uid;
        this.currentUserName$ = user.displayName;
        // return user.uid;  EINE CALL BACK FN KANN NICHTS RETURNEN
      } else {
        this.currentUserId$ = null;
        // return null;   EINE CALL BACK FN KANN NICHTS RETURNEN
      }
    });
  }

  async getCurrentUserData() {
    const docRef = doc(this.usersCollection, this.currentUserId$);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
      return docSnap.data();
    } else {
      console.log('No such document!');
      //hier muss der Error noch abgefangen werden
      return null;
    }
  }


  async updateDisplayName(arg) {
    const docRef = doc(this.usersCollection, this.currentUserId$);
    await updateDoc(docRef, {
      displayName: arg,
    });
  }
  async updatePhotoUrl(arg) {
    const docRef = doc(this.usersCollection, this.currentUserId$);
    await updateDoc(docRef, {
      photoURL: arg,
    });
  }
  async updateFirstName(arg) {
    const docRef = doc(this.usersCollection, this.currentUserId$);
    await updateDoc(docRef, {
      firstName: arg,
    });
  }
  async updateLastName(arg) {
    const docRef = doc(this.usersCollection, this.currentUserId$);
    await updateDoc(docRef, {
      lastName: arg,
    });
  }
  async updateEmail(arg) {
    const docRef = doc(this.usersCollection, this.currentUserId$);
    await updateDoc(docRef, {
      email: arg,
    });
  }
  async updateBirthdate(arg) {
    const docRef = doc(this.usersCollection, this.currentUserId$);
    await updateDoc(docRef, {
      birthDate: arg,
    });
  }
  async updateStreet(arg) {
    const docRef = doc(this.usersCollection, this.currentUserId$);
    await updateDoc(docRef, {
      street: arg,
    });
  }
  async updateZipCode(arg) {
    const docRef = doc(this.usersCollection, this.currentUserId$);
    await updateDoc(docRef, {
      zipCode: arg,
    });
  }
  async updateCity(arg) {
    const docRef = doc(this.usersCollection, this.currentUserId$);
    await updateDoc(docRef, {
      city: arg,
    });
  }
}
