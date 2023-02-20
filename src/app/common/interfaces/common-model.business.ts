export interface ICommonBusiness<T> {
  create(...args: any[]): Promise<T>;
  update(...args: any[]): Promise<T>;
  delete(...args: any[]): Promise<T>;
  get(...args: any[]): Promise<T>;
}
