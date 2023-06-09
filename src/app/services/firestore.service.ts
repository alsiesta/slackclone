import { Injectable } from '@angular/core';
import { UserTemplate } from '../models/usertemplate.class';
import { Channel } from '../models/channel.class';
import { Chat } from '../models/chat.class';
import { Thread } from '../models/thread.class';
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
  private chatCollection: CollectionReference<DocumentData>;
  private threadCollection: CollectionReference<DocumentData>;
  private docRef: DocumentReference<any>;
  user = new UserTemplate();
  channel = new Channel();
  chat = new Chat();
  thread = new Thread();
  channelList: any;
  // chat = new Chat();
  users: any = [];
  currentUserData: any;

  constructor(private firestore: Firestore) {
    this.usersCollection = collection(this.firestore, GLOBAL_VARS.USERS);
    this.channelCollection = collection(this.firestore, GLOBAL_VARS.CHANNELS);
    this.chatCollection = collection(this.firestore, GLOBAL_VARS.CHATS);
    this.threadCollection = collection(this.firestore, GLOBAL_VARS.THREADS);
  }

  async readChannels() {
    const querySnapshot = await getDocs(collection(this.firestore, 'channels'));
    this.channelList = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Channel;
      const id = doc.id;
      return { id, ...data };
    });
    console.log(this.channelList);
  }

  addNewChannel(uid: string, channel) {
    // check and avoid channel name doublication!!!
    let dateTime = new Date();
    this.channel.creationDate = dateTime;
    this.channel.creator = channel.creator;
    this.channel.info = channel.info;
    this.channel.title = channel.title;
    const docRef = doc(this.channelCollection, uid);
    setDoc(docRef, this.channel.toJSON())
      .then(() => {
        console.log('New Channel added to firestore');
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async addNewChat(chat?: Chat) {
    const docRef = await addDoc(this.chatCollection, chat);
    console.log('Chat was added to Firebase: ', docRef.id);
    const chatRef = doc(this.chatCollection, docRef.id);
    await updateDoc(chatRef, {
      chatId: docRef.id,
    });
  }

  async addNewThread(thread?: Thread) {
    const docRef = await addDoc(this.threadCollection, thread);
    console.log('Thread was added to Firebase: ', docRef.id);
    const chatRef = doc(this.threadCollection, docRef.id);
      await updateDoc(chatRef, {
        threadId: docRef.id,
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
