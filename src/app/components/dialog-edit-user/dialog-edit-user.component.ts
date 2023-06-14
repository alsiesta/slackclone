import {Component, Inject} from '@angular/core';
import {MatDialogRef,MatDialog, MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import {NgIf} from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { UsersService } from 'src/app/services/users.service';
import { UserTemplate } from 'src/app/models/usertemplate.class';

export interface DialogData {
  displayName;
  email;
  photoUrl;
  emailVerified;
  uid;
}

@Component({
  selector: 'app-dialog-edit-user',
  templateUrl: './dialog-edit-user.component.html',
  styleUrls: ['./dialog-edit-user.component.scss']
})
export class DialogEditUserComponent {
  constructor (@Inject(MAT_DIALOG_DATA) public data: DialogData, public usersService: UsersService) { }

  currentUserData$: UserTemplate;

  ngOnInit () {
   return this.usersService.getCurrentUserData()
      .then((data) => {
        this.currentUserData$ = data;
        console.log(this.currentUserData$);
      })
}


 currentUserFirstName$() {
    
  }
  
      
      
  
}
