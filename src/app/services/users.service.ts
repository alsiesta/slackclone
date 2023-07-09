import { Injectable } from '@angular/core';
import * as GLOBAL_VARS from 'src/app/shared/globals';
import { Auth, User, onAuthStateChanged } from '@angular/fire/auth';

import { BehaviorSubject, Observable } from 'rxjs';
import {
  collection,
  Firestore,
  collectionData,
  doc,
  getDoc,
  updateDoc,
  query,
  onSnapshot,
  DocumentReference,
  docData,
  DocumentData,
  DocumentSnapshot,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
  
export class UsersService {
  constructor(
    private firestore: Firestore,
    private auth: Auth
  ) {
    this.getCurrentUserId();
  }
  ngOnInit() {
    this.keepUsersUptodate();
    this.observCurrentUser().subscribe((data) => {
      this.currentUserData$ = data;
    });
  }

  usersCollection = collection(this.firestore, GLOBAL_VARS.USERS);
  public usersCollListener = new BehaviorSubject<any>({ users: [] });

  currentUserId$: any;
  currentUserEmail$: any;
  currentUserName$: any;
  currentUserData$: any;
  currentUserPhoto: any;
  currentUsers: any;
  // fsUser = new UserTemplate();
  
  currentUserRef = collection(this.firestore, GLOBAL_VARS.USERS, );
  

  keepUsersUptodate() {
    // const usersCollection = collection(this.firestore, GLOBAL_VARS.USERS);
    const users$ = collectionData(this.usersCollection, { idField: 'uid' });
    users$.subscribe((_users) => {
      this.usersCollListener.next({ users: _users });
      this.currentUsers = _users;
    });
  }

  observCurrentUser (): Observable<any[]> {
      const q = query(this.usersCollection);
  
      return new Observable<any[]>((observer) => {
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const user = [];
          querySnapshot.forEach((doc) => {
            user.push(doc.data());
          });
          observer.next((this.currentUserData$ = user));
        });
  
        //Cleanup function to unsubscribe when the Observable is unsubscribed
        return () => {
          unsubscribe();
        };
      });
    }
  

  getAllUsers(): User[] {
    return this.currentUsers;
  }
  
  
  /**
   * 1. get current user from firebase auth
   * 2. set local properties to user data (id, name)
   * @returns current user data from firebase auth
   */
  getCurrentUserId(): string {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserId$ = user.uid;
        this.currentUserName$ = user.displayName;
        this.currentUserPhoto = user.photoURL;
      } else {
        this.currentUserId$ = null;
      }
    });
    return this.currentUserId$
  }


  // AS PROMISE
  async getCurrentUserData(): Promise<any> {
    const docRef: DocumentReference<DocumentData> = doc(this.usersCollection, this.currentUserId$);
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(docRef);
    if (docSnap.exists()) {
      this.currentUserData$ = docSnap.data();
      // return docSnap.data();
      return this.currentUserData$;
    } else {
      console.log('No such User in Firestore!');
      //hier muss der Error noch abgefangen werden
      return null;
    }
  }
  
  // AS OBSERVABLE
  getUserById$(userId: string): Observable<User> {
    const usersDocRef: DocumentReference = doc(this.usersCollection, userId);
    return docData(usersDocRef, { idField: 'UserId' }) as Observable<User>;
  }
  
  async updateUserFieldValue(field:string,arg:any) {
    const docRef:DocumentReference<DocumentData> = doc(this.usersCollection, this.currentUserId$);
    await updateDoc(docRef, {
      [field]: arg,
    });
  }
  
}
