/*
 * @Author: pmx
 * @Date: 2022-12-20 14:01:27
 * @Last Modified by: pmx
 * @Last Modified time: 2023-01-12 15:37:17
 */

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TimeService {
  /**
   *  日期起始：1970-1-1 00:00:00 UTC
   * @param time
   * @returns 任意一天的开始时间（中国区）
   */
  static beginTime(time: Date | string | number) {
    // if (time instanceof Date) {
    //   return new Date(new Date(time).setHours(0, 0, 0, 0));
    // } else if (typeof time == 'string') {
    //   // 有效的日期字符串
    //   if (isNaN(Date.parse(time)) || Date.parse(time) < 0) {
    //     throw new TypeError('INVALID TIME');
    //   }
    //   return new Date(new Date(time).setHours(0, 0, 0, 0));
    // } else if (typeof time == 'number' && time > 0) {
    //   return new Date(new Date(time).setHours(0, 0, 0, 0));
    // } else {
    //   throw new TypeError('INVALID TYPE');
    // }

    if (this.isValidDate(time)) {
      return new Date(new Date(time).setHours(0, 0, 0, 0));
    } else {
      throw new TypeError('INVALID TYPE');
    }
  }
  // 任意一天的结束时间
  static endTime(time: Date | string | number) {
    if (time instanceof Date) {
      return new Date(new Date(time).setHours(23, 59, 59, 999));
    } else if (typeof time == 'string') {
      if (isNaN(Date.parse(time)) || Date.parse(time) < 0) {
        throw new TypeError('INVALID TIME');
      }
      return new Date(new Date(time).setHours(23, 59, 59, 999));
    } else if (typeof time == 'number' && time > 0) {
      return new Date(new Date(time).setHours(23, 59, 59, 999));
    } else {
      throw new TypeError('INVALID TYPE');
    }
  }
  // 后退n天
  static backDate(time: Date, n: number) {
    return new Date(new Date(time).getTime() - n * 24 * 60 * 60 * 1000);
  }
  // 前进n天
  static forwardDate(time: Date, n: number) {
    return new Date(new Date(time).getTime() + n * 24 * 60 * 60 * 1000);
  }
  /**
   * 当前日期所在的周
   * @param time 当前时间
   * @param firstIsSunday 服务器第一天是星期一
   * @returns \{beginTime:Date,endTime:Date}
   */
  static curWeek(time: Date | string | number, firstIsSunday = false) {
    let t: Date;
    if (time instanceof Date) {
      t = new Date(time);
    } else if (typeof time == 'string') {
      if (isNaN(Date.parse(time)) || Date.parse(time) < 0) {
        throw new TypeError('INVALID TIME');
      }
      t = new Date(time);
    } else if (typeof time == 'number' && time > 0) {
      t = new Date(time);
    } else {
      throw new TypeError('INVALID TYPE');
    }
    let offset = t.getDay() - (firstIsSunday ? 0 : 1);
    let beginTime = TimeService.beginTime(this.backDate(t, offset));
    let endTime = TimeService.endTime(TimeService.forwardDate(beginTime, 6));
    return {
      beginTime,
      endTime,
    };
  }
  // 当前日期所在的月
  static curMonth(time: Date | string | number) {
    let t: Date;
    if (time instanceof Date) {
      t = new Date(time);
    } else if (typeof time == 'string') {
      if (isNaN(Date.parse(time)) || Date.parse(time) < 0) {
        throw new TypeError('INVALID TIME');
      }
      t = new Date(time);
    } else if (typeof time == 'number' && time > 0) {
      t = new Date(time);
    } else {
      throw new TypeError('INVALID TYPE');
    }
    let beginTime = new Date(t.getFullYear(), t.getMonth(), 1, 0, 0, 0, 0);
    let endTime = new Date(t.getFullYear(), t.getMonth() + 1, 1, 0, 0, 0, 0);
    endTime = TimeService.endTime(TimeService.backDate(endTime, 1));
    return {
      beginTime,
      endTime,
    };
  }

  static isValidDate(time: Date | string | number) {
    if (typeof time === 'string') {
      if (isNaN(Date.parse(time)) || Date.parse(time) < 0) {
        return false;
      }
    } else if (typeof time == 'number' && time < 0) return false;

    return true;
  }

  beginTime(time: Date | string | number) {
    if (this.isValidDate(time)) {
      return new Date(new Date(time).setHours(0, 0, 0, 0));
    } else {
      throw new TypeError('INVALID TYPE');
    }
  }
  endTime(time: Date | string | number) {
    if (this.isValidDate(time)) {
      return new Date(new Date(time).setHours(23, 59, 59, 999));
    } else {
      throw new TypeError('INVALID TYPE');
    }
  }

  isValidDate(time: Date | string | number) {
    if (typeof time === 'string') {
      if (isNaN(Date.parse(time)) || Date.parse(time) < 0) {
        return false;
      }
    } else if (typeof time == 'number' && time < 0) return false;

    return true;
  }
}
