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
import { User } from 'firebase/auth';

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

  usersList: any;
  channelList: any;
  threadList: any;
  chatList: any;
  // users: any = [];

  constructor(private firestore: Firestore) {
    this.usersCollection = collection(this.firestore, GLOBAL_VARS.USERS);
    this.channelCollection = collection(this.firestore, GLOBAL_VARS.CHANNELS);
    this.chatCollection = collection(this.firestore, GLOBAL_VARS.CHATS);
    this.threadCollection = collection(this.firestore, GLOBAL_VARS.THREADS);
  }

  /////// diese Funktion muss noch fertig geschrieben werden, um den Code UNTEN zu minimieren
  // async addNewDocToCollection(collection, item: any) {
  //   // const docRef = await addDoc(this.threadCollection, thread);
  //   const docRef = await addDoc(collection, item);
  //   // console.log('Thread was added to Firebase: ', docRef.id);
  //   console.log(
  //     `Doc with ID ${docRef.id} was added to Collection: ${collection}`
  //   );
  // }

  ///////////////// CHANNEL FUNKTIONEN ///////////////////
  async readChannels() {
    const querySnapshot = await getDocs(collection(this.firestore, 'channels'));
    this.channelList = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Channel;
      const id = doc.id;
      return { id, ...data };
    });
    console.log(this.channelList);
  }

 async addNewChannel(uid: string, channel: Channel) {
    // check and avoid channel name doublication!!!
   const ref = doc(this.channelCollection, uid);
   await setDoc(ref, channel)
      .then(() => {
        console.log('New Channel added to firestore', uid);
      })
      .catch((error) => {
        console.log(error);
      });
   await updateDoc(ref, {
     channelID: uid,
   });

    // let dateTime = new Date();
    // this.channel.creationDate = dateTime;
    // this.channel.creator = channel.creator;
    // this.channel.info = channel.info;
    // this.channel.title = channel.title;
    // const docRef = doc(this.channelCollection, uid);
    // setDoc(docRef, this.channel.toJSON())
    //   .then(() => {
    //     console.log('New Channel added to firestore');
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
  }

  async getSpecificChannel(id) {
    const docRef = doc(this.channelCollection, id);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    if (docSnap.exists()) {
      console.log('Document data of chat:', data);
      return data;
    } else {
      console.log('No such document!');
      return null;
    }
  }
    ///////////////// CHAT FUNKTIONEN ///////////////////

  async addNewChat(chat?: Chat) {
    const docRef = await addDoc(this.chatCollection, chat);
    console.log('Chat was added to Firebase: ', docRef.id);
    const ref = doc(this.chatCollection, docRef.id);
    await updateDoc(ref, {
      chatId: docRef.id,
    });
  }

  async getSpecificChat(id) {
    const docRef = doc(this.chatCollection, id);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    if (docSnap.exists()) {
      console.log('Document data of chat:', data);
      return data;
    } else {
      console.log('No such document!');
      return null;
    }
  }

  
  async getAllChats() {
    const querySnapshot = await getDocs(this.chatCollection);
    this.chatList = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Chat;
      return data
    });
    console.log(this.chatList);
  }
  ///////////////// THREAD FUNKTIONEN ///////////////////

  async addNewThread(thread?: Thread) {
    const docRef = await addDoc(this.threadCollection, thread);
    console.log('Thread was added to Firebase: ', docRef.id);
    const ref = doc(this.threadCollection, docRef.id);
      await updateDoc(ref, {
        threadId: docRef.id,
      });
  }

  async getSpecificThread(id) {
    const docRef = doc(this.threadCollection, id);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    if (docSnap.exists()) {
      console.log('Document data of threads:', data);
      return data
    } else {
      console.log('No such document!');
      return null;
    }
  }

  async getAllThreads() {
    const querySnapshot = await getDocs(this.threadCollection);
    this.threadList = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Thread;
      return data
    });
    console.log(this.threadList);
  }

  ///////////////// USER FUNKTIONEN ///////////////////

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

  async getSpecificUser(id) {
    const docRef = doc(this.usersCollection, id);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    if (docSnap.exists()) {
      console.log('Document data of user:', data);
      return data;
    } else {
      console.log('No such document!');
      return null;
    }
  }

  async getAllUsers() {
    const querySnapshot = await getDocs(this.usersCollection);
    this.usersList = querySnapshot.docs.map((doc) => {
      const data = doc.data() as UserTemplate;
      return data
    });
    console.log(this.usersList);
  }


    ///////////////// HELPER FUNCTIONS ///////////////////

  getDocRef(uid) {
    this.docRef = doc(this.usersCollection, uid);
    return this.docRef;
  }

  getDocData(uid) {
    const gameData = docData(this.getDocRef(uid));
    return gameData;
  }
}
