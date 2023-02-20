/*
 * @Author: pmx
 * @Date: 2022-12-28 10:47:27
 * @Last Modified by: pmx
 * @Last Modified time: 2023-01-16 13:52:37
 */
/**
 *   arr = [
      '清华大学',
      '北京大学',
      '复旦大学',
      '上海交通大学',
      '浙江大学',
    ];

    arr.sort()按照Unicode来排序，而汉字的 Unicode 是杂乱无章的 
     ['上海交通大学', '北京大学', '复旦大学', '浙江大学', '清华大学']

     使用Intl.Collator能得到按字典排序的正确结果
      ['北京大学', '复旦大学', '清华大学', '上海交通大学', '浙江大学']
 * 
 */
export class LocaleCompare {
  static compare(a: any, b: any, isAsc: boolean = true) {
    if (a === b) return 0;
    if (a === undefined) return 1;
    if (b === undefined) return -1;
    if (a === null) return 1;
    if (b === null) return -1;

    if (typeof a == 'string' && typeof b == 'string') {
      if (this._localeCompareSupportsLocales()) {
        let collator = new Intl.Collator('zh-CN', {
          caseFirst: 'upper',
          sensitivity: 'variant',
          numeric: true,
        });
        return collator.compare(a, b) * (isAsc ? 1 : -1);
      } else {
        return (a.length - b.length || a.localeCompare(b)) * (isAsc ? 1 : -1);
      }
    }
    if (typeof a == 'number' && typeof b == 'number') {
      return a - b;
    }
    if (typeof a == 'boolean' && typeof b == 'boolean') {
      return a < b ? -1 : 1;
    }
    const aString = String(a);
    const bString = String(b);
    return (
      (aString == bString ? 0 : aString < bString ? -1 : 1) * (isAsc ? 1 : -1)
    );
  }
  private static _localeCompareSupportsLocales() {
    try {
      'foo'.localeCompare('bar', 'i');
    } catch (e: any) {
      return e.name === 'RangeError';
    }
    return false;
  }
}
