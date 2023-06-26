import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  chatOpened: boolean = false;
  channelOpened: boolean = true;
  threadsRightSideOpened: boolean = false;
  usersShortcutOpened: boolean = false;
  threadsShortcutOpened: boolean = false;

  constructor() {}

  /**
   * returns a list of unique dates
   */
  uniqueList(list: Array<any>) {
    let uniqueList = list.filter(
      (value, index, array) => array.indexOf(value) === index
    );
    list = [];
    uniqueList.forEach((element: any) => {
      list.push(element);
    });
    return list;
  }

  /**
   * returns a sorted list of dates
   */
  sortingDateList(dateList: Array<any>) {
    dateList.sort((a, b) => a.localeCompare(b));
    return dateList;
  }

  /**
   * returns an array of threads sorted by time
   */
  sortThreadsByTime(threadList: Array<any>) {
    threadList.sort((a, b) => a.time.localeCompare(b.time));
    return threadList;
  }

  /**
   * opens the component passed as parameter and closes the others
   * @param component - name of the component to open
   */
  openComponent(component: string) {
    this.chatOpened = false;
    this.channelOpened = false;
    this.usersShortcutOpened = false;
    this.threadsShortcutOpened = false;

    switch (component) {
      case 'chat':
        this.chatOpened = true;
        break;
      case 'channel':
        this.channelOpened = true;
        break;
      case 'usersShortcut':
        this.usersShortcutOpened = true;
        break;
      case 'threadShortcut':
        this.threadsShortcutOpened = true;
        break;
      default:
        break;
    }
  }
}
