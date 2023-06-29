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
            const date = new Date(value.replace(/-/g, '/').replace('T', ' ').replace('Z', ''));
            console.log('date:', value);
            
            const seconds = Math.floor((+new Date() - +date) / 1000);
            if (seconds < 29) {
                return 'Just now';
            }

            const intervals: Intervals = {
                'Jahr': 31536000,
                'Monat': 2592000,
                'Woche': 604800,
                'Tag': 86400,
                'Stunde': 3600,
                'Minute': 60,
                'Sekunde': 1
            };

            for (const i in intervals) {
                if (intervals.hasOwnProperty(i)) {
                    const counter = Math.floor(seconds / intervals[i]);
                    if (counter > 0) {
                        if (counter === 1) {
                            return 'vor ' + counter + ' ' + i;
                        } else if(counter > 1 && (i == 'Jahr' || i == 'Monat' || i == 'Tag')) {
                            return 'vor ' + counter + ' ' + i + 'en'; 
                        } else if(counter > 1 && (i == 'Woche' || i == 'Minute' || i == 'Sekunde' || i == 'Stunde')) {
                          return 'vor ' + counter + ' ' + i + 'n';
                      }
                    }
                }
            }
        }
        return value;
    }
}

