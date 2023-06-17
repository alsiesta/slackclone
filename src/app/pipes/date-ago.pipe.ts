import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'dateAgo',
    pure: true
})
export class DateAgoPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if (value) {
            const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
            if (seconds < 29) // less than 30 seconds ago will show as 'Just now'
                return 'vor wenigen Sekunden';
            const intervals = {
                'Jahr': 31536000,
                'Monat': 2592000,
                'Woche': 604800,
                'Tag': 86400,
                'Stunde': 3600,
                'Minute': 60,
                'Sekunde': 1
            };
            let counter;
            for (const i in intervals) {
                counter = Math.floor(seconds / intervals[i]);
                if (counter > 0)
                    if (counter === 1) {
                        return 'vor ' + counter + ' ' + i;
                    } if(counter > 1 && (i == 'Jahr' || i == 'Monat' || i == 'Tag')) {
                        return 'vor ' + counter + ' ' + i + 'en'; 
                    } if(counter > 1 && (i == 'Woche' || i == 'Minute' || i == 'Sekunde')) {
                      return 'vor ' + counter + ' ' + i + 'n';
                  }
            }
        }
        return value;
    }

}