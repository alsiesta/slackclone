import { Pipe, PipeTransform } from '@angular/core';

interface Intervals {
  [key: string]: number;
}

@Pipe({
  name: 'dateAgo',
  pure: true
})
export class DateAgoPipe implements PipeTransform {
  transform(value: any, args?: any): any {
    if (value) {
      const date = new Date(value);
      const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: 'Europe/Berlin'
      };
      const localDate = date.toLocaleString('de-DE', options);
      const currentDate = new Date();

      const seconds = Math.floor((currentDate.getTime() - date.getTime()) / 1000);
      if (seconds < 29) {
        return 'Just now';
      }

      const intervals: Intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
      };

      for (const i in intervals) {
        if (intervals.hasOwnProperty(i)) {
          const counter = Math.floor(seconds / intervals[i]);
          if (counter > 0) {
            if (counter === 1) {
              return counter + ' ' + i + ' ago';
            } else {
              return counter + ' ' + i + 's ago';
            }
          }
        }
      }
    }
    return value;
  }
}
