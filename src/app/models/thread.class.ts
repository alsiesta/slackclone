export class Thread {
  threadId: string; // firestore id
  user: string; // creator user id to get name and image
  date: Date; // date of creation
  time: Date; // time of creation
  content: string; // content of thread
  channel: string; // channel id as recipient of thread -- (either or)
  chat: string; // chat id as recipient of thread -- (either or)
  replies: string[]; // array of thread ids

  constructor(obj?: any) {
    this.threadId = obj ? obj.threadId : '';
    this.user = obj ? obj.user : '';
    this.date = obj ? obj.date : '';
    this.time = obj ? obj.time : '';
    this.content = obj ? obj.content : '';
    this.channel = obj ? obj.channel : '';
    this.chat = obj ? obj.chat : '';
    this.replies = obj ? obj.replies : '';
  }

  public toJSON(): any {
    return {
      threadId: this.threadId,
      user: this.user,
      date: this.date,
      time: this.time,
      content: this.content,
      channel: this.channel,
      chat: this.chat,
      replies: this.replies,
    };
  }
}
