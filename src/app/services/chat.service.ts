import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  chatPartnerImage = 'assets/img/threads/profile-picture.png';
  chatPartnerName = 'John Doe';
  chatDates: Array<any> = ['03.06.2023', '04.06.2023'];
  messages: Array<any> = [
    {
      user: 'John Doe',
      image: 'assets/img/threads/profile-picture.png',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      date: '04.06.2023',
    },
    {
      user: 'Maxi Muster',
      image: 'assets/img/threads/profile-picture.png',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      date: '04.06.2023',
    },
  ];

  constructor() {}
}
