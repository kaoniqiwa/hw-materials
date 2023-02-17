import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'date_time_pipe', pure: false })
export class DateTimePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(date: Date) {
    return formatDate(date, 'yyyy年MM月dd日 HH:mm:ss', 'en');
  }
}
