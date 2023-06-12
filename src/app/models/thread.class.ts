export class Thread {
  threadId: string; // firestore id firestore auto-generated id
  user: string; // creator user id to get name and image
  date: Date; // date of creation
  time: Date; // time of creation
  content: string; // content of thread
  channel: string; // channel id (#..........)
  replies: { user: string; date?: Date; message: string }[]; // stores reply objects
  //(nice-to-have: emoji)

  constructor(obj?: any) {
    this.threadId = obj ? obj.threadId : '';
    this.user = obj ? obj.user : '';
    this.date = obj ? obj.date : '';
    this.time = obj ? obj.time : '';
    this.content = obj ? obj.content : '';
    this.channel = obj ? obj.channel : '';
    // this.replies = obj ? obj.replies : '';
    this.replies = obj ? obj.replies : '';
  }


  // public toJSON?(): any {
  //   return {
  //     threadId: this.threadId,
  //     user: this.user,
  //     date: this.date.toLocaleDateString('de-DE', {
  //       year: 'numeric',
  //       month: '2-digit',
  //       day: '2-digit',
  //     }),
  //     time: this.time.toLocaleTimeString([], {
  //       hour: '2-digit',
  //       minute: '2-digit',
  //     }),
  //     content: this.content,
  //     channel: this.channel,
  //     replies: this.replies,
  //   };
  // }

  public toJSON?(): any {
    const formattedReplies = this.replies.map(reply => {
      const formattedDate = reply.date ? reply.date.toLocaleDateString('de-DE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }) : undefined;
      return {
        user: reply.user,
        date: formattedDate,
        message: reply.message,
      };
    });
  
    return {
      threadId: this.threadId,
      user: this.user,
      date: this.date.toLocaleDateString('de-DE', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
            }),
      time: this.time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      content: this.content,
      channel: this.channel,
      replies: formattedReplies,
    };
  }
}
