export class Thread {
  threadId: string; // firestore id firestore auto-generated id
  user: string; // creator user id to get name and image
  date: Date; // date of creation
  time: Date; // time of creation
  content: string; // content of thread
  channel: string; // channel id (#..........)
  images: string[]; // array of image urls
  replies: { user: string; date: Date; message: string; images: string[] }[]; // stores reply objects

  constructor(obj?: any) {
    this.threadId = obj ? obj.threadId : '';
    this.user = obj ? obj.user : '';
    this.date = obj ? obj.date : '';
    this.time = obj ? obj.time : '';
    this.content = obj ? obj.content : '';
    this.channel = obj ? obj.channel : '';
    this.images = obj ? obj.images : [];
    this.replies = obj ? obj.replies : '';
  }

  public toJSON?(): any {
    const formattedReplies = this.replies.map((reply) => {
      const formattedDate = reply.date ? reply.date.toISOString() : '';
      return {
        user: reply.user,
        date: formattedDate,
        message: reply.message,
        images: reply.images,
      };
    });

    return {
      threadId: this.threadId,
      user: this.user,
      date: this.date.toISOString(),
      time: this.time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      content: this.content,
      channel: this.channel,
      images: this.images,
      replies: formattedReplies,
    };
  }
}
