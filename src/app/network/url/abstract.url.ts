export abstract class AbstractUrl {
  constructor(protected base: string) {}
  basic(): string {
    return this.base;
  }
  item<T = string>(id: T) {
    return `${this.basic()}/${id}`;
  }
  list() {
    return `${this.basic()}/List`;
  }
}
