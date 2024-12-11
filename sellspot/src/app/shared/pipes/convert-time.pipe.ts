import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'convertTime',
  standalone: true
})
export class ConvertTimePipe implements PipeTransform {

  transform(date: number, ...args: unknown[]): unknown {
    return moment(date).fromNow();
  }

}
