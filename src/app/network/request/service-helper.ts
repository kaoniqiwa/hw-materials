import { ClassConstructor, plainToInstance } from 'class-transformer';
import { PagedList } from '../entity/page.entity';

export class ServiceHelper {
  static ResponseProcess<T>(
    response: PagedList<T>,
    t: ClassConstructor<T>
  ): Promise<PagedList<T>>;
  static ResponseProcess<T>(response: T, t: ClassConstructor<T>): Promise<T>;
  static ResponseProcess<T>(
    response: T[],
    t: ClassConstructor<T>
  ): Promise<T[]>;

  static ResponseProcess<T>(response: T, basic: boolean): Promise<T>;

  static async ResponseProcess<T>(
    response: T | T[] | PagedList<T>,
    t: ClassConstructor<T> | boolean
  ) {
    if (typeof t === 'boolean') {
      return response;
    } else if ((response as PagedList<T>).Page) {
      let result = response as PagedList<T>;
      result.Data = plainToInstance(
        t,
        (response as PagedList<T>).Data
      ) as unknown as T[];
      return plainToInstance(PagedList, result);
    } else {
      return plainToInstance(t, response);
    }
  }
}
