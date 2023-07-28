import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ChatService } from 'src/app/services/chat.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-dialog-create-new-chat',
  templateUrl: './dialog-create-new-chat.component.html',
  styleUrls: ['./dialog-create-new-chat.component.scss']
})
export class DialogCreateNewChatComponent {
  dmForm: FormGroup;
  userList: any[];
  filteredUsers: any[];
  isButtonDisabled: boolean = true;

  /**
   * Constructor function
   * 
   * @param formBuilder - FormBuilder instance used to create the form group.
   * @param usersService - UsersService instance used to retrieve the user list.
   */
  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private chatService: ChatService,
    private dialogRef: MatDialogRef<DialogCreateNewChatComponent>) {
      
    // Create the form group using the formBuilder
    this.dmForm = this.formBuilder.group({
      displayName: ''
    });

     // Retrieve the user list from the usersService and deletes the currentUser from it.
    this.userList = this.usersService.currentUsers;
    let currentUser = this.usersService.currentUserId$;
    this.userList = this.userList.filter(user => user.uid !== currentUser);
    // initialize the filteredUsers array with the user list
    this.filteredUsers = this.userList;
  }

  /**
   * Method for selecting a user from the autocomplete list.
   * 
   * @param user - The selected user object.
   */
  selectUser(user: any) {
    this.dmForm.value.displayName = user.displayName;
    this.dmForm.value.uid = user.uid;
    this.isButtonDisabled = false;
  }

  /**
   * Method for filtering the user list based on the input value.
   * 
   */
  filterUsers() {
    const searchValue = this.dmForm.value.displayName.toLowerCase();
    this.filteredUsers = this.userList.filter(user => {
      const displayNameLower = user.displayName.toLowerCase();
      return displayNameLower.includes(searchValue) && displayNameLower.indexOf(searchValue) === 0;
    });

    this.isButtonDisabled = !this.filteredUsers.some(user => user.displayName.toLowerCase() == searchValue);
  }

  /**
   * OnSubmit Method. Opens or creates a chat with the selected user depending if there is already an existing one.
   * 
   */
  onSubmit() {
    this.chatService.openChat(this.dmForm.value.uid);
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}