import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from 'src/app/services/users.service';
import { UserTemplate } from 'src/app/models/usertemplate.class';
import { Observable } from 'rxjs';
import { FirestoreService } from 'src/app/services/firestore.service';
import { and } from 'firebase/firestore';

export interface DialogData {
  displayName;
  email;
  photoUrl;
  emailVerified;
  uid;
}
export interface IsEditing {
  displayName?: boolean;
  firstName?: boolean;
  lastName?: boolean;
  email?: boolean;
  photoUrl?: boolean;
  emailVerified?: boolean;
  city?: boolean;
  zipCode?: boolean;
  street?: boolean;
  birthDate?: boolean;
  uid?: boolean;
}

@Component({
  selector: 'app-dialog-edit-user',
  templateUrl: './dialog-edit-user.component.html',
  styleUrls: ['./dialog-edit-user.component.scss'],
})
export class DialogEditUserComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public usersService: UsersService,
    public firestoreService: FirestoreService
  ) {}

  currentUserData$: UserTemplate;

  isEditing: IsEditing = {
    displayName: false,
    firstName: false,
    lastName: false,
    email: false,
    city: false,
    zipCode: false,
    street: false,
    photoUrl: false,
    birthDate: false,
    emailVerified: false,
    uid: false,
  };

  currentUser$: any;
  currentUserId$: string;
  currentUser: UserTemplate;
  counter: number = 0;
  chat: any;

  ngOnInit() {
    this.currentUserId$ = this.usersService.getCurrentUserId();
    this.observable.subscribe(this.subscriber);
    this.firestoreService.observeChat$.subscribe((data) => {
      console.log(data);
      this.chat = data;
    });
  }

  observable = new Observable((subscriber) => {
    // subscriber.next(this.currentUserId$);
    subscriber.next(
      (this.currentUser$ = this.usersService.getUserById$(this.currentUserId$))
    );
    subscriber.next(
      this.currentUser$.subscribe((data) => {
        this.currentUser = data;
      })
    );
    // subscriber.error();
    subscriber.complete();
  });

  subscriber = {
    next: (data) => {
      this.counter++;
      console.log(
        `${
          this.counter
        }.) Subscriber received \"${typeof data}\" with this data:`,
        data
      );
    },
    error: (error) => {
      console.error('An error occurred:', error);
    },
    complete: () => {
      console.log('Subscriber Complete');
    },
  };

  updateUserProperty(field, value) {
    this.usersService.updateUserFieldValue(field, value);
    this.cancelEdit(field);
  }

  log(displayName) {
    console.log(displayName);
  }

  cancelEdit(field) {
    switch (field) {
      case 'displayName':
        this.isEditing.displayName = false;
        break;
      case 'firstName':
        this.isEditing.firstName = false;
        break;
      case 'lastName':
        this.isEditing.lastName = false;
        break;
      case 'email':
        this.isEditing.email = false;
        break;
      case 'city':
        this.isEditing.city = false;
        break;
      case 'street':
        this.isEditing.street = false;
        break;
      case 'zipCode':
        this.isEditing.zipCode = false;
        break;
      case 'birthDate':
        this.isEditing.birthDate = false;
        break;
      case 'photoUrl':
        this.isEditing.photoUrl = false;
        break;
      case 'emailVerified':
        this.isEditing.emailVerified = false;
        break;
      default:
        break;
    }
  }

  startEdit(field) {
    switch (field) {
      case 'displayName':
        this.isEditing.displayName = true;
        break;
      case 'firstName':
        this.isEditing.firstName = true;
        break;
      case 'lastName':
        this.isEditing.lastName = true;
        break;
      case 'email':
        this.isEditing.email = true;
        break;
      case 'city':
        this.isEditing.city = true;
        break;
      case 'street':
        this.isEditing.street = true;
        break;
      case 'zipCode':
        this.isEditing.zipCode = true;
        break;
      case 'birthDate':
        this.isEditing.birthDate = true;
        break;
      case 'photoUrl':
        this.isEditing.photoUrl = true;
        break;
      case 'emailVerified':
        this.isEditing.emailVerified = true;
        break;
      default:
        break;
    }
  }
}
