import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ChannelDialogComponent } from '../components/channel-dialog/channel-dialog.component';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  //channel object
  channelInfo: any = {
    channelName: '# allgemein',
    channelCreator: 'Mike Meyer',
    channelDate: '03.06.2023',
  };

  //posting object
  postings: Array<any> = [
    {
      user: 'John Doe',
      image: 'assets/img/threads/profile-picture.png',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nunc aliquet nunc',
      date: '03.06.2023',
      time: '16:25',
      id: '1234567890',
      threads: [],
    },
    {
      user: 'Joana Denver',
      image: 'assets/img/threads/profile-picture.png',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies, nunc nunc aliquet nunc',
      date: '04.06.2023',
      time: '18:25',
      id: '1234567891',
      threads: [
        {
          user: 'John Doe',
          image: 'assets/img/threads/profile-picture.png',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          date: '04.06.2023',
        },
        {
          user: 'Maxi Muster',
          image: 'assets/img/threads/profile-picture.png',
          content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit',
          date: '04.06.2023',
        },
      ],
    },
  ];

  // to be implemented by function
  dates: Array<any> = ['03.06.2023', '04.06.2023'];

  constructor(public channelDialog: MatDialog) {}

  /**
   * open the channel-info dialog
   */
  channelDialogOpen() {
    const dialogRef = this.channelDialog.open(ChannelDialogComponent, {
      maxWidth: '100vw',
    });
  }
}
