import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hwtime',
})
export class HwTimePipe implements PipeTransform {
  transform(time: number) {
    let hour = Math.floor(time / 60);
    let minute = time - hour * 60;
    let res = hour == 0 ? minute + '分钟' : hour + '小时' + minute + '分钟';
    return res;
  }
}
