import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  constructor(private formBuilder: FormBuilder, private usersService: UsersService) {
    // Create the form group using the formBuilder
    this.dmForm = this.formBuilder.group({
      displayName: ''
    });

     // Retrieve the user list from the usersService, initialize the filteredUsers array with the user list
    this.userList = this.usersService.currentUsers;
    this.filteredUsers = this.userList;
  }

  /**
   * Method for selecting a user from the autocomplete list.
   * 
   * @param user - The selected user object.
   */
  selectUser(user: any) {
    this.dmForm.value.displayName = user.displayName;
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

  onSubmit() {
    console.log('Button',this.dmForm.value.displayName);
  }
}
