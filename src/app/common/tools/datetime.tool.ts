import { Duration } from 'src/app/model/duration.model';

export class DateTimeTool {
  static allMonth(date: Date): Duration {
    let duration = {
      begin: new Date(),
      end: new Date(),
    };
    duration.begin = new Date(date.getFullYear(), date.getMonth(), 1);
    let next = new Date(duration.begin.getTime());
    next.setMonth(next.getMonth() + 1);
    next.setMilliseconds(-1);
    duration.end = next;
    return duration;
  }
  static allDay(date: Date): Duration {
    let duration = {
      begin: new Date(),
      end: new Date(),
    };
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    duration.begin = new Date(year, month, day);
    let next = new Date(duration.begin.getTime());
    next.setDate(next.getDate() + 1);
    next.setMilliseconds(-1);
    duration.end = next;
    return duration;
  }
  static allWeek(date: Date, firstDay = 1): Duration {
    let duration = {
      begin: new Date(),
      end: new Date(),
    };
    let year = date.getFullYear();
    let month = date.getMonth();
    let day = date.getDate();
    let weekDay = date.getDay() - firstDay;

    let begin = new Date(year, month, day);
    begin.setDate(begin.getDate() - weekDay);
    begin.toISOString;
    duration.begin = begin;
    let next = new Date(begin.getTime());
    next.setDate(next.getDate() + 7);
    next.setMilliseconds(-1);
    duration.end = next;
    return duration;
  }

  static beforeOrAfter(date: Date, seconds: number = 30): Duration {
    let duration = {
      begin: new Date(),
      end: new Date(),
    };

    let begin = new Date(date.getTime());
    begin.setSeconds(begin.getSeconds() - seconds);
    duration.begin = new Date(begin.getTime());

    let end = new Date(date.getTime());
    end.setSeconds(end.getSeconds() + seconds);
    duration.end = end;

    return duration;
  }
  static second(date: Date, before: number, after: number): Duration {
    let duration = {
      begin: new Date(date.getTime()),
      end: new Date(date.getTime()),
    };
    duration.begin.setSeconds(duration.begin.getSeconds() + before);
    duration.end.setSeconds(duration.end.getSeconds() + after);
    return duration;
  }
}
