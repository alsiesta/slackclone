export class Channel {
  channelID: string; // firestore Custom id (#........)
  title: string; // channel name
  creator: string; // user id of creator
  creationDate: Date; // date of creation
  info: string; // description
  isActive: boolean // sidebar handler

  constructor(obj?: any) {
    this.channelID = obj ? obj.channelID : '';
    this.title = obj ? obj.title : '';
    this.creator = obj ? obj.creator : '';
    this.creationDate = obj ? obj.creationDate : '';
    this.info = obj ? obj.info : '';
    this.isActive = false; 
  }

  public toJSON?(): any {
    return {
      channelID: this.channelID,
      title: this.title,
      creator: this.creator,
      creationDate: this.creationDate.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      info: this.info,
    };
  }
}
