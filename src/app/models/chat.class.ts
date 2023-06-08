export class Chat {
  chatId: string; // firestore id firestore auto-generated id
  chatUsers: string[]; // user ids of the two chat partners
  chat: string[] = []; // stores chat objects

  constructor(obj?: any) {
    this.chatId = obj ? obj.chatId : '';
    this.chatUsers = obj ? obj.chatUser : '';
  }

  public toJSON(): any {
    return {
      chatId: this.chatId,
      chatUser: this.chatUsers,
    };
  }
}
