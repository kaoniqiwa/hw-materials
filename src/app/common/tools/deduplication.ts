export class Deduplication {
  static generateExclude(condition: string) {
    let res: string[] = [];
    for (let i = 0; i < condition.length; i++) {
      let len = condition.length - i;
      let temp = '';
      for (let j = 0; j < len; j++) {
        temp += condition[i + j];
        res.push(temp);
      }
    }

    return res;
  }

  static generateExcludeArray(inputGuards: string[]) {
    let result: string[] = [];
    inputGuards.reduce((previous, current) => {
      previous.push(...this.generateExclude(current));
      return previous;
    }, result);

    return result;
  }
}