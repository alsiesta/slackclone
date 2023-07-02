import { Injectable } from '@angular/core';
import { UserTemplate } from '../models/usertemplate.class';
import { Channel } from '../models/channel.class';
import { Chat } from '../models/chat.class';
import { Thread } from '../models/thread.class';
import * as GLOBAL_VARS from 'src/app/shared/globals';
import {
  addDoc,
  collection,
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
  arrayUnion,
  query,
  onSnapshot,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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
  // isChannelDoublicated: boolean;
  usersList: any;
  channelList: any;
  threadList: any;
  chatList: any;
  currentUserId: string;

  constructor(private firestore: Firestore) {
    this.usersCollection = collection(this.firestore, GLOBAL_VARS.USERS);
    this.channelCollection = collection(this.firestore, GLOBAL_VARS.CHANNELS);
    this.chatCollection = collection(this.firestore, GLOBAL_VARS.CHATS);
    this.threadCollection = collection(this.firestore, GLOBAL_VARS.THREADS);
  }

  /////////////////////////// CHANNEL FUNCTIONS ///////////////////////////
  /**
   *
   * @returns Promise that resolves to an array of all channels
   */
  async readChannels() {
    const querySnapshot = await getDocs(collection(this.firestore, 'channels'));
    this.channelList = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Channel;
      const id = doc.id;
      return { id, ...data };
    });
    return this.channelList;
  }

  /**
   *
   * @returns Observable that listens to changes in the channels collection
   */
  getChannelList(): Observable<any[]> {
    const q = query(collection(this.firestore, GLOBAL_VARS.CHANNELS));

    return new Observable<any[]>((observer) => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const channels = [];
        querySnapshot.forEach((doc) => {
          channels.push(doc.data());
        });
        observer.next((this.channelList = channels));
      });

      //Cleanup function to unsubscribe when the Observable is unsubscribed
      return () => {
        unsubscribe();
      };
    });
  }

  /**
   *
   * Function checks if channel id already exists and if false adds a new channel to firestore
   * @param cid
   * @param channel
   * @returns Promise that resolves to the channel id of the newly added channel
   */
  async addNewChannel (cid: string, channel: Channel) {
    if (await this.isChannelDoublicated(cid)) {
      console.log('Channel already exists');
      return null;
    } else {
      let dateTime = new Date();
      this.channel.creationDate = dateTime;
      this.channel.creator = channel.creator;
      this.channel.info = channel.info;
      this.channel.title = channel.title;
      const ref = doc(this.channelCollection, cid);

      await setDoc(ref, this.channel.toJSON())
        .then(() => {
          console.log('New Channel added to firestore', cid);
        })
        .catch((error) => {
          console.log(error);
        });
      await updateDoc(ref, {
        channelID: cid,
      });
    }
  }

 async isChannelDoublicated(cid: string) {
    const channelList = await this.readChannels();
    let isChannelDoublicated: boolean;
   channelList.forEach((channel: Channel) => {
     if (channel.channelID === cid) {
       isChannelDoublicated = true;
       return isChannelDoublicated;
     } else {
       return null
     }
   });
   return isChannelDoublicated;
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

  ngOnInit() {}

  ///////////////// CHAT FUNKTIONEN ///////////////////

  /**
   *
   * @returns Observable that listens to changes in the chats collection
   */
  chatListener = () => {
    const q = query(collection(this.firestore, GLOBAL_VARS.CHATS));

    return new Observable((subscriber) => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const chats = [];
        querySnapshot.forEach((doc) => {
          // console.log('Change occured in this chat: ', doc.data()); // Specific doc that changed
          chats.push(doc.data());
        });
        // console.log('Current chats: ', chats); // All chats as an array

        subscriber.next(chats); // Emit the chats data to the subscriber
      });
      // Return the subscriber method
      return {
        unsubscribe() {
          unsubscribe();
        },
      };
    });
  };

  getChatList(): Observable<any[]> {
    const q = query(collection(this.firestore, GLOBAL_VARS.CHATS));

    return new Observable<any[]>((observer) => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const chats = [];
        querySnapshot.forEach((doc) => {
          chats.push(doc.data());
        });
        observer.next((this.chatList = chats));
      });

      //Cleanup function to unsubscribe when the Observable is unsubscribed
      return () => {
        unsubscribe();
      };
    });
  }

  /**
   *   Observable that listens to changes in the chats collection
   */
  observeChat$ = this.chatListener();

  // /**
  //  * Subscription to the observable
  //  */
  // subscription = this.observeChat$.subscribe((chats) => {
  //   console.log('Received chats in subscription:', chats); // All chats as an array
  // });

  /**
   * Unsubscribe from the observable
   */
  // subscription.unsubscribe ();

  /**
   * adding a new chat to the firestore
   * @param chat
   */
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

  async addUserToChat(chatId: string, newUser: string) {
    const chatRef = doc(this.chatCollection, chatId);
    await updateDoc(chatRef, {
      chatUsers: arrayUnion(newUser),
    });
  }

  async addChatMessage(chatId, user, message) {
    const date = new Date();
    const formdate = date.toISOString().split('T')[0];
    const formtime = date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    const arg = {
      user: user,
      date: formdate,
      time: formtime,
      message: message,
    };
    const chatRef = doc(this.chatCollection, chatId);
    await updateDoc(chatRef, {
      chat: arrayUnion(arg),
    });
  }

  async getAllChats() {
    const querySnapshot = await getDocs(this.chatCollection);
    this.chatList = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Chat;
      return data;
    });
    return this.chatList;
  }
  ///////////////// THREAD FUNKTIONEN ///////////////////

  ///// LISTENER listening to THREADS CHANGE
  query = query(collection(this.firestore, GLOBAL_VARS.THREADS));
  uunsubscribe = onSnapshot(this.query, (querySnapshot) => {
    const threads = [];
    querySnapshot.forEach((doc) => {
      //  threads.push(doc.data()['channel']);
      threads.push(doc.data());
    });
    this.threadList = threads;
    console.log('Thread changed: ', this.threadList);
    return this.threadList;
  });

  ///// LISTENER AS OBSERVABLE listening to THREADS CHANGE

  getThreadList(): Observable<any[]> {
    const q = query(collection(this.firestore, GLOBAL_VARS.THREADS));

    return new Observable<any[]>((observer) => {
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const threads = [];
        querySnapshot.forEach((doc) => {
          threads.push(doc.data());
        });
        observer.next((this.threadList = threads));
      });

      //Cleanup function to unsubscribe when the Observable is unsubscribed
      return () => {
        unsubscribe();
      };
    });
  }

  async addNewThread(thread?: Thread) {
    let dateTime = new Date();
    this.thread.date = dateTime;
    this.thread.user = thread.user;
    this.thread.time = thread.time;
    this.thread.content = thread.content;
    this.thread.channel = thread.channel;
    this.thread.replies = thread.replies;

    const docRef = await addDoc(this.threadCollection, this.thread.toJSON());

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
      return data;
    } else {
      console.log('No such document!');
      return null;
    }
  }

  async getAllThreads() {
    const querySnapshot = await getDocs(this.threadCollection);
    this.threadList = querySnapshot.docs.map((doc) => {
      const data = doc.data() as Thread;
      return data;
    });
    return this.threadList;
  }

  async updateSpecificThread(
    threadId: string,
    message: string,
    currentUserId: string
  ) {
    const date = new Date();
    const formattedDate = date.toISOString();
    const arg = {
      user: currentUserId,
      date: formattedDate,
      message: message,
    };

    const ref = doc(this.threadCollection, threadId);
    await updateDoc(ref, {
      replies: arrayUnion(arg),
    });
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

  async updateSpecificUser(id, data: UserTemplate) {
    const docRef = doc(this.usersCollection, id);
    await updateDoc(docRef, {
      password: data.password,
      displayName: data.displayName,
      photoURL: data.photoURL,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      birthDate: data.birthDate,
      street: data.street,
      zipCode: data.zipCode,
      city: data.city,
    });
  }

  async getAllUsers() {
    const querySnapshot = await getDocs(this.usersCollection);
    this.usersList = querySnapshot.docs.map((doc) => {
      const data = doc.data() as UserTemplate;
      return { id: doc.id, ...data };
    });
    return this.usersList as UserTemplate[];
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
