import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from 'src/app/services/users.service';
import { UserTemplate } from 'src/app/models/usertemplate.class';
import { Observable } from 'rxjs';
import { FirestoreService } from 'src/app/services/firestore.service';
import { and } from 'firebase/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { Storage , ref, uploadBytesResumable,getDownloadURL, uploadBytes, getStorage} from '@angular/fire/storage';
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
  constructor (
    public storage: Storage,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public usersService: UsersService,
    public firestoreService: FirestoreService,
    public authService: AuthService
  ) {}

  selectedFile: File;
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  async onUpload(): Promise<void> {
    if (!this.selectedFile) {
      return;
    }
    const storage = getStorage();
    const storageRef = ref(storage, this.selectedFile.name);
    await uploadBytes(storageRef, this.selectedFile);

    const downloadURL = await getDownloadURL(storageRef);
    console.log('File available at: ', downloadURL);
    this.updateUserProperty ('photoURL', downloadURL)   }


  // addData () {
  //   const storageRef = ref(this.storage, this.file.name);
  //   const uploadTask = uploadBytesResumable(storageRef, this.file);
  //   uploadTask.on('state_changed', (snapshot) => {
  //     const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
  //     console.log('Upload is ' + progress + '% done');
  //   },() => {
  //     getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
  //       console.log('File available at', downloadURL);
  //     });
  //   });
  // }

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

  /**
   * // update user property in specific field in firebase firestore.
   * // update displayName in firebase auth in case it was changed.
   * @param field 
   * @param value 
   */
  updateUserProperty (field, value) {
    this.usersService.updateUserFieldValue(field, value);
    console.log(this.usersService.currentUserName$)
    if (field === 'displayName') {
      this.authService.updateAuthdisplayName(value);
    } else if (field === 'photoURL') {
      this.authService.updateAuthPhoto(value);
    }
    // this.authService.getAuthCredentials();
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
