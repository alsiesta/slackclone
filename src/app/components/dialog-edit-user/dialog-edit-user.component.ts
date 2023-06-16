import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from 'src/app/services/users.service';
import { UserTemplate } from 'src/app/models/usertemplate.class';
import { Observable } from 'rxjs';

export interface DialogData {
  displayName;
  email;
  photoUrl;
  emailVerified;
  uid;
}
export interface IsEditing {
  displayName?:boolean;
  email?:boolean;
  photoUrl?:boolean;
  emailVerified?:boolean;
  uid?:boolean;
}

@Component({
  selector: 'app-dialog-edit-user',
  templateUrl: './dialog-edit-user.component.html',
  styleUrls: ['./dialog-edit-user.component.scss'],
})
export class DialogEditUserComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    public usersService: UsersService
  ) {}

  currentUserData$: UserTemplate;
  isEditing = false;
  currentUser$: any;
  currentUserId$: string;
  currentUser: UserTemplate;
  counter: number = 0;

  ngOnInit() {
    this.currentUserId$ = this.usersService.getCurrentUserId();
    this.observable.subscribe(this.subscriber);
  }

  observable = new Observable((subscriber) => {
    subscriber.next(this.currentUserId$);
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
    this.isEditing = false;    
  }

  cancelEdit() {
    this.isEditing = false;
  }

  startEdit() {
    this.isEditing = true;
  }
}
