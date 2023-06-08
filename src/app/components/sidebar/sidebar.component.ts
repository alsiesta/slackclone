import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  channelsAreOpen = true;
  directmessagesAreOpen = true;

  ngOnInit(): void {
    
  }

  toggleDropdown(key) {
    switch (key) {
      case 'ch':
          this.channelsAreOpen = !this.channelsAreOpen;
        break;

      case 'dm':
          this.directmessagesAreOpen = !this.directmessagesAreOpen;
        break;

      default:
        break;
    }
  }
}
