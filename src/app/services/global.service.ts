import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalService {
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
}
