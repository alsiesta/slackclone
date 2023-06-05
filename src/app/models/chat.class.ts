export class Chat {
  chatId: string; // firestore id
  chatUser: string[]; // user ids of the two chat partners

  constructor(obj?: any) {
    this.chatId = obj ? obj.chatId : '';
    this.chatUser = obj ? obj.chatUser : '';
  }

  public toJSON(): any {
    return {
      chatId: this.chatId,
      chatUser: this.chatUser,
    };
  }
}
