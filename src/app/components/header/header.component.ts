import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';
import {
  collection,
  Firestore,
  collectionData,
  getDoc,
  doc,
} from '@angular/fire/firestore';
import { getAuth, onAuthStateChanged } from '@angular/fire/auth';
import { UserTemplate } from 'src/app/models/usertemplate.class';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  constructor(
    private firestore: Firestore,
    public authService: AuthService,
    private router: Router,
    public usersService: UsersService
  ) {}
  currentUserDisplayName: string | undefined;
  user = new UserTemplate();
  currentUserDisplayName2: string | undefined;

  ngOnInit() {
    this.usersService.getCurrentUserId();
    console.log('ngOnInit() called');
    this.usersService.getCurrentUserData().subscribe((user: UserTemplate) => {
      this.user = user;
      console.log('this is my user:', this.user);
    });

    const auth = getAuth();
    /////////working version
    auth.onAuthStateChanged((user) => {
      const usersCollection = collection(this.firestore, 'users');
      const docRef = doc(usersCollection, user.uid);

      getDoc(docRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const userData = docSnapshot.data();
          this.currentUserDisplayName = userData['displayName'];
        }
      });
    });

    /////////not working version
    this.usersService.getCurrentUserDisplayName2().then((displayName) => {
      this.currentUserDisplayName2 = displayName;
    });
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['']);
  }

  logUserId() {
    this.usersService.logUserId();
  }

  logAllUsers() {
    this.usersService.getAllUsers();
  }

  logCurrentUserData() {
    console.log(this.currentUserDisplayName);
  }
  logCurrentUserData2() {
    console.log(typeof this.usersService.getCurrentUserDisplayName2());
  }
}
