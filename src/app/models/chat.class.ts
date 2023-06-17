export class Chat {
  chatId: string; // firestore id firestore auto-generated id
  chatUsers: string[]; // user ids of the two chat partners
  chat: { user: string; date: Date; message: string }[]; // stores chat objects

  constructor(obj?: any) {
    this.chatId = obj ? obj.chatId : '';
    this.chatUsers = obj ? obj.chatUser : '';
    this.chat = obj ? obj.chat : '';
  }

  public toJSON?(): any {
    return {
      chatId: this.chatId,
      chatUsers: this.chatUsers,
      chat: this.chat,
    };
  }

  // public addUser(userId: string): void {
  //   this.chatUsers.push(userId);
  // }
}
