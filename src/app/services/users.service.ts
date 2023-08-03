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
  currentUserRef = collection(this.firestore, GLOBAL_VARS.USERS, );
  
/**
* Observes the users collection in Firestore and updates the local users array
 */
  keepUsersUptodate() {
    const users$ = collectionData(this.usersCollection, { idField: 'uid' });
    users$.subscribe((_users) => {
      this.usersCollListener.next({ users: _users });
      this.currentUsers = _users;
    });
  }

  /**
   * Observes the current user data in Firestore
   * @returns Observable of the current user data
   */
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
  
/**
 * @returns all users from the users collection in Firestore
 */
  getAllUsers(): User[] {
    return this.currentUsers;
  }
  
  
  /**
   * @returns current user id
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


/**
 * Retrieves the current user data from Firestore and returns it as a Promise
 * @returns Promise of the current user data
 */
  async getCurrentUserData(): Promise<any> {
    const docRef: DocumentReference<DocumentData> = doc(this.usersCollection, this.currentUserId$);
    const docSnap: DocumentSnapshot<DocumentData> = await getDoc(docRef);
    if (docSnap.exists()) {
      this.currentUserData$ = docSnap.data();
      return this.currentUserData$;
    } else {
      console.log('No such User in Firestore!');
      return null;
    }
  }
  
/**
 * retrieves the user data from Firestore by the user id
 * @param userId 
 * @returns Observable 
 */
  getUserById$(userId: string): Observable<User> {
    const usersDocRef: DocumentReference = doc(this.usersCollection, userId);
    return docData(usersDocRef, { idField: 'UserId' }) as Observable<User>;
  }
  
  /**
   * is used in the dialog-edit-user.component.ts
   * @param field indicates the field that was changed
   * @param arg represents the new value of the field
   */
  async updateUserFieldValue(field:string,arg:any) {
    const docRef:DocumentReference<DocumentData> = doc(this.usersCollection, this.currentUserId$);
    await updateDoc(docRef, {
      [field]: arg,
    });
  }
  
}
