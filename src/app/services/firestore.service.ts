import { Injectable } from '@angular/core';
import { UserTemplate } from '../models/usertemplate.class';
import { Channel } from '../models/channel.class';
import * as GLOBAL_VARS from 'src/app/shared/globals';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  doc,
  docData,
  DocumentData,
  DocumentReference,
  Firestore,
  updateDoc,
  setDoc,
  getDoc,
  getDocs,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class FirestoreService {
  private usersCollection: CollectionReference<DocumentData>;
  private channelCollection: CollectionReference<DocumentData>;
  private docRef: DocumentReference<any>;
  user = new UserTemplate();
  channel = new Channel();
  // chat = new Chat();
  users: any = [];
  currentUserData: any;

  constructor(private firestore: Firestore) {
    this.usersCollection = collection(this.firestore, GLOBAL_VARS.USERS);
    this.channelCollection = collection(this.firestore, GLOBAL_VARS.CHANNELS);
  }

  async readChannels () {
    const querySnapshot = await getDocs(collection(this.firestore, "channels"));
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, " => ", doc.data());
});
}

  addNewChannel (uid: string, channel?: Channel) {
    let dateTime = new Date()
    this.channel.creationDate = dateTime;
    this.channel.creator = 'current User';
    this.channel.info = 'info';
    this.channel.title = 'title';
    const docRef = doc(this.channelCollection, uid);
    setDoc(docRef, this.channel.toJSON())
      .then(() => {
        console.log('New Channel added to firestore');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  addNewUser(uid: string, name, email, password) {
    this.user.displayName = name;
    this.user.email = email;
    this.user.password = password;
    const docRef = doc(this.usersCollection, uid);
    setDoc(docRef, this.user.toJSON())
      .then(() => {
        console.log('New Document added to firestore');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getDocRef(uid) {
    this.docRef = doc(this.usersCollection, uid);
    return this.docRef;
  }

  getDocData(uid) {
    const gameData = docData(this.getDocRef(uid));
    return gameData;
  }

  // getCollection(collectionName: string) {
  //   return collection(this.firestore, collectionName);
  // }

  // updateDocument(id, user) {
  //   updateDoc(this.getDocRef(id), user)
  //     .then(() => {
  //       console.log(
  //         'A New Document Field has been added to an existing document'
  //       );
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  // createDoc(user) {
  //   return addDoc(this.usersCollection, user.toJSON()).then((result) => {
  //     console.log(result);
  //   });
  // }

  // getUsers$() {
  //   return collectionData(this.usersCollection, {
  //     idField: 'docId',
  //   });
  // }

  // getUsers = async () => {
  //   onSnapshot(this.usersCollection, (snapshot) => {
  //     snapshot.forEach((doc) => {
  //       const user = doc.data();
  //       this.users.push(user);
  //     });
  //   });
  //   return this.users;
  // };
}
