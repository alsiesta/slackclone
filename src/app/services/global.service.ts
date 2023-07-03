import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  chatOpened: boolean = false;
  channelOpened: boolean = true;
  threadsRightSideOpened: boolean = false;
  usersShortcutOpened: boolean = false;
  threadsShortcutOpened: boolean = false;
  private isSidebarOpenSubject = new Subject<boolean>();
  isSidebarOpen$ = this.isSidebarOpenSubject.asObservable();
  private isSidebarOpen = true;
  public menuIcon = 'menu_open'

  constructor(private breakpointObserver: BreakpointObserver) {
    const customMinBreakpoint = '(min-width: 769px)'; // Breite ab der die Sidebar immer sichtbar sein soll
  
    this.breakpointObserver.observe([customMinBreakpoint])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.isSidebarOpen = true; // Sidebar always open, if min breakpoint is reached
          this.isSidebarOpenSubject.next(this.isSidebarOpen);
          this.menuIcon = this.isSidebarOpen ? 'menu_open' : 'menu';
        }
      });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.isSidebarOpenSubject.next(this.isSidebarOpen);
    this.menuIcon = this.isSidebarOpen ? 'menu_open' : 'menu';
  }

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
   * returns a sorted list of dates (descending)
   */
  sortingDateList(dateList: Array<any>) {
    dateList.sort((a, b) => a.localeCompare(b));
    return dateList;
  }

  /**
   * sorts the threads by date (ascending)
   * @param threadList - list of threads to sort
   * @returns
   */
  sortingThreadsOnDate(threadList: Array<any>) {
    threadList.sort((a, b) => b.date.localeCompare(a.date));
    return threadList;
  }

  /**
   * returns an array of threads sorted by time (descending)
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
      case 'threadsShortcut':
        this.threadsShortcutOpened = true;
        break;
      default:
        break;
    }
  }
}
