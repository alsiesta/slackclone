export class Chat {
  chatId: string; // firestore id firestore auto-generated id
  chatUsers: string[]; // user ids of the two chat partners
  chat: {
    user: string;
    date: Date;
    time: Date;
    message: string;
    images: string[];
  }[]; // stores chat objects

  constructor(obj?: any) {
    this.chatId = obj ? obj.chatId : '';
    this.chatUsers = obj ? obj.chatUser : '';
    this.chat = obj ? obj.chat : '';
  }

  public toJSON?(): any {
    const formattedChat = this.chat.map((chat) => {
      const formattedDate = chat.date
        ? chat.date.toISOString().split('T')[0]
        : '';
      const formattedTime = chat.time
        ? chat.time.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })
        : '';
      return {
        user: chat.user,
        date: formattedDate,
        time: formattedTime,
        message: chat.message,
        images: chat.images,
      };
    });

    return {
      chatId: this.chatId,
      chatUsers: this.chatUsers,
      chat: formattedChat,
    };
  }
}
