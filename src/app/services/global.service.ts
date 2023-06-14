import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
  constructor() {}

  /**
   * returns a list of unique dates
   */
  uniqueDateList(dateList: Array<any>) {
    let uniqueDateList = dateList.filter(
      (value, index, array) => array.indexOf(value) === index
    );
    dateList = [];
    uniqueDateList.forEach((element: any) => {
      dateList.push(element);
    });
    return dateList;
  }

  /**
   * returns a sorted list of dates
   */
  sortingDateList(dateList: Array<any>) {
    dateList.sort((a, b) => a.localeCompare(b));
    return dateList;
  }

  /**
   * returns a array of threads sorted by time
   */
  sortThreadsByTime(threadList: Array<any>) {
    threadList.sort((a, b) => a.time.localeCompare(b.time));
    return threadList;
  }
}
