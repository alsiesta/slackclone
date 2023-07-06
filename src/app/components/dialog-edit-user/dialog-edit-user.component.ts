import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from 'src/app/services/users.service';
import { UserTemplate } from 'src/app/models/usertemplate.class';
import { Observable } from 'rxjs';
import { FirestoreService } from 'src/app/services/firestore.service';
import { and } from 'firebase/firestore';
import { AuthService } from 'src/app/services/auth.service';
import {
  Storage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  uploadBytes,
  getStorage,
  getMetadata,
  updateMetadata,
} from '@angular/fire/storage';
import { state } from '@angular/animations';
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
    public storage: Storage,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public usersService: UsersService,
    public firestoreService: FirestoreService,
    public authService: AuthService
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
  currentUserId$: any;
  currentUser: UserTemplate;
  googleCurrentUser: UserTemplate;
  counter: number = 0;
  chat: any;
  isGuestUserActive: boolean = false;

  async ngOnInit() {
    this.currentUserId$ = this.usersService.getCurrentUserId();
    this.checkIfGuestUserIsActive();
    this.observable.subscribe(this.subscriber);
    this.firestoreService.observeChat$.subscribe((data) => {
      // console.log(data);
      this.chat = data;
    });
  }

  /**
   * // check if guest user is logged-in. This is important, because the guest user is not allowed to edit his profile.
   */
  checkIfGuestUserIsActive() {
    if (this.currentUserId$ === '9KjVGbYn8qOQ9dprTIAxuJ6fpOv2') {
      this.isGuestUserActive = true;
      // console.log('GuestUser is logged-in: ',this.isGuestUserActive);
    }
  }

  /**
   * // observable to get the current user data from firestore.
   * // the data is stored in the currentUser$ variable.
   */
  observable = new Observable((subscriber) => {
    subscriber.next(
      (this.currentUser$ = this.usersService.getUserById$(this.currentUserId$))
    );
    subscriber.next(
      this.currentUser$.subscribe((data) => {
        this.currentUser = data;
      })
    );
    subscriber.complete();
  });

  subscriber = {
    next: (data) => {
      this.counter++;
    },
    error: (error) => {
      console.error('An error occurred:', error);
    },
    complete: () => {},
  };

  /**
   * // update user property in specific field in firebase firestore.
   * // updates displayName OR photoURL in firebase auth in case it was changed.
   * @param field
   * @param value
   */
  updateUserProperty(field, value) {
    this.usersService.updateUserFieldValue(field, value);
    if (field === 'displayName') {
      this.authService.updateAuthdisplayName(value);
    } else if (field === 'photoURL') {
      this.authService.updateAuthPhoto(value);
    }
    this.cancelEdit(field);
  }

  selectedFile: File;
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.onUpload();
  }

  async onUpload(): Promise<void> {
    if (!this.selectedFile) {
      return;
    }
    const storage = getStorage();
    const fileName = this.currentUserId$ + '_' + this.selectedFile.name;
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, this.selectedFile);
    getMetadata(storageRef)
      .then((metadata) => {
        console.log(metadata);
      })
      .catch((error) => {
        console.log(error);
      });

    const downloadURL = await getDownloadURL(storageRef);
    this.updateUserProperty('photoURL', downloadURL);
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
