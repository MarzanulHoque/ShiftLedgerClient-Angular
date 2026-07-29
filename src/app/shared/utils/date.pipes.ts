import { Pipe, PipeTransform } from '@angular/core';

import { formatDate, formatDateTime } from './date.util';

@Pipe({ name: 'utcDateTime', standalone: true })
export class UtcDateTimePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return formatDateTime(value);
  }
}

@Pipe({ name: 'dateOnly', standalone: true })
export class DateOnlyPipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return formatDate(value);
  }
}
