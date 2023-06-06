import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import * as GLOBAL_VARS from 'src/app/shared/globals';
import { UserTemplate } from '../models/usertemplate.class';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { BehaviorSubject, Observable, from, map, switchMap } from 'rxjs';
import { collection, Firestore, collectionData, doc, getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor (private firestoreService: FirestoreService, private firestore: Firestore) { }
  usersCollection = collection(this.firestore, GLOBAL_VARS.USERS);
  currentUserDisplayName;
  currenUserId;
  public usersCollListener = new BehaviorSubject<any>({ users: [] });
  
  currentUsers: any;
  $currentUserData: any;
  user = new UserTemplate();

  // keepUsersUptodate() {
  //   // const usersCollection = collection(this.firestore, GLOBAL_VARS.USERS);
  //   const users$ = collectionData(this.usersCollection, { idField: 'uid' });
  //   users$.subscribe((_users) => {
  //     this.usersCollListener.next({ users: _users });
  //     console.log(_users);
  //     this.currentUsers = _users;
  //   });
  // }

  logUserId() {
    return this.getCurrentUserId();
  }

  getAllUsers () {
    console.log(this.currentUsers)
  }

  async getCurrentUserId(): Promise<string | null>  {
    const auth = getAuth();
    // await onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     console.log('received UID in users.service: ', user.uid);
    //     this.currenUserId = user.uid;
    //     return user.uid;
    //   } else {
    //     return null;
    //   }
    // });
    const user = auth.currentUser;

  if (user) {
    console.log('Received UID in users.service:', user.uid);
    this.currenUserId = user.uid;
    return user.uid;
  } else {
    return null;
  }
  }



  getCurrentUserDisplayName2(): Promise<string | undefined> {
    const auth = getAuth();
    const tolleruser = auth.currentUser;

    if (tolleruser) {
      const docRef = doc(this.usersCollection, tolleruser.uid);

      return getDoc(docRef).then(docSnapshot => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          console.log('From users.service: ', userData?.['displayName']);
          return userData?.['displayName'];
        }
        return undefined;
      });
    }

    return Promise.resolve(undefined);
  }

  getCurrentUserData (): Observable<UserTemplate> {
    console.log('Inside getCurrentUserData()');
    return from(this.getCurrentUserId()).pipe(
      switchMap((value) => {
        this.currenUserId = value;
        console.log('Current user ID:', this.currenUserId);
        return this.firestoreService.getDocData(this.currenUserId);
      }),
      map((response: any) => {
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
        console.log('User object:', this.user.toJSON());
        return this.user;
      })
    );
  }


 
}


