import { Component } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';

@Component({
  selector: 'app-dialog-attachment-image',
  templateUrl: './dialog-attachment-image.component.html',
  styleUrls: ['./dialog-attachment-image.component.scss']
})
export class DialogAttachmentImageComponent {

  constructor(
    public channelService: ChannelService,
  ) { }
}
