import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'unique',
  pure: false,
})
export class UniquePipe implements PipeTransform {
  // compares the user id of the replies and returns a unique list of replies (for image preview in channel)
  transform(reply: any): any {
    const uniqueReply = reply.filter(
      (reply: any, index: any, self: any) =>
        index === self.findIndex((t: any) => t.user.id === reply.user.id)
    );
    return uniqueReply;
  }
}
