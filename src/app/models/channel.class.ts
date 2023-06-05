export class Channel {
  channelID: string; // firestore id
  title: string; // channel name
  creator: string; // user id of creator
  creationDate: Date; // date of creation
  info: string; // description

  constructor(obj?: any) {
    this.channelID = obj ? obj.channelID : '';
    this.title = obj ? obj.title : '';
    this.creator = obj ? obj.creator : '';
    this.creationDate = obj ? obj.creationDate : '';
    this.info = obj ? obj.info : '';
  }

  public toJSON(): any {
    return {
      channelID: this.channelID,
      title: this.title,
      creator: this.creator,
      creationDate: this.creationDate,
      info: this.info,
    };
  }
}
