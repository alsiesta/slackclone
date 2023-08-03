import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from 'src/app/services/users.service';
import { UserTemplate } from 'src/app/models/usertemplate.class';
import { Observable } from 'rxjs';
import { HotToastService } from '@ngneat/hot-toast';
import { FirestoreService } from 'src/app/services/firestore.service';
import { AuthService } from 'src/app/services/auth.service';
import {
  Storage,
  ref,
  getDownloadURL,
  uploadBytes,
  getStorage,
} from '@angular/fire/storage';

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
    public authService: AuthService,
    private toast: HotToastService,
  ) {}

  currentUserData$: UserTemplate;

  /**
   * // isEditing is an object that stores the editing status of each field.
   * // isEditing is used to show/hide the edit button and the save button.
   */
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

  /**
   * // ngOnInit is called when the component is initialized.
   * // it gets the current user id from the usersService.
   * // it checks if the guest user is active.
   * // it subscribes to the observable to get the current user data from firestore.
   * // it subscribes to the observable to get the chat data from firestore.
   * // it sets the currentUser$ variable to the current user data.
   */
  async ngOnInit() {
    this.currentUserId$ = this.usersService.getCurrentUserId();
    this.checkIfGuestUserIsActive();
    this.observable.subscribe(this.mysubscriber);
    this.firestoreService.observeChat$.subscribe((data) => {
      this.chat = data;
    });
  }

  /**
   * // check if guest user is logged-in. This is important, because the guest user is not allowed to edit his profile.
   */
  checkIfGuestUserIsActive() {
    if (this.currentUserId$ === 'FX6K2L7Xbgfouk3qmpCisBO1eT42') {
      this.isGuestUserActive = true;
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

  /**
   * // mysubscriber is used to subscribe to the observable named observable.
   */
  mysubscriber = {
    next: (data) => {
      this.counter++;
    },
    error: (error) => {
      this.toast.error(`Error: ${error}`);
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

  /**
   * // selectedFile represents the file that is selected by the user.
   * // onFileSelected is called when the user selects a file.
   */
  selectedFile: File;
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    this.onUpload();
  }

  async onUpload(): Promise<void> {
    if (!this.selectedFile) {
      return;
    }
    const fileName = this.currentUserId$ + '_' + this.selectedFile.name;
    await this.uploadToFirebase(fileName);
    const downloadURL = await this.getDownloadURL(fileName);
    this.updateUserProperty('photoURL', downloadURL);
  }

  private async uploadToFirebase(fileName: string): Promise<void> {
    const storage = getStorage();
    const storageRef = ref(storage, fileName);
    await uploadBytes(storageRef, this.selectedFile);
  }

  /**
   * returns the download url of the uploaded file.
   * @param fileName 
   * @returns storageRef as string
   */
  private async getDownloadURL(fileName: string): Promise<string> {
    const storage = getStorage();
    const storageRef = ref(storage, fileName);
    return getDownloadURL(storageRef);
  }

/**
 * cancelEdit is called when the user clicks on the cancel button to stopp editing.
 * @param field 
 */
  cancelEdit(field) {
    if (this.isEditing[field]) {
      this.isEditing[field] = false;
    } else {
      this.toast.error(`Sorry, the field ${field} was not being edited.`);
    }
}

/**
 * startEdit is called when the user clicks on the edit button to start editing.
 * @param field 
 */
  startEdit(field) {
    if (this.isEditing[field] === undefined) {
      throw new Error(`Cannot start editing unknown field: ${field}`);
    }
    this.isEditing[field] = true;
  }
}
