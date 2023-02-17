import { ClassConstructor, plainToInstance } from 'class-transformer';
import { HowellResponse } from '../model/howell-response.model';
import { PagedList } from '../model/page_list.model';

export class ServiceHelper {
  static ResponseProcess<T>(
    response: HowellResponse<PagedList<T>>,
    t: ClassConstructor<T>
  ): Promise<PagedList<T>>;
  static ResponseProcess<T>(
    response: HowellResponse<T>,
    t: ClassConstructor<T>
  ): Promise<T>;
  static ResponseProcess<T>(
    response: HowellResponse<T[]>,
    t: ClassConstructor<T>
  ): Promise<T[]>;

  static ResponseProcess<T>(
    response: HowellResponse<T>,
    basic: boolean
  ): Promise<T>;

  static async ResponseProcess<T>(
    response: HowellResponse<T | T[] | PagedList<T>>,
    t: ClassConstructor<T> | boolean
  ) {
    // 如果返回码不为0
    if (response.FaultCode != 0) {
      console.error(response.FaultReason, response.InnerException);
      throw new Error(response.FaultReason);
    }

    if (typeof t === 'boolean') {
      return response.Data;
    } else if ((response.Data as PagedList<T>).Page) {
      let result = response.Data as PagedList<T>;
      result.Data = plainToInstance(
        t,
        (response.Data as PagedList<T>).Data
      ) as unknown as T[];
      return plainToInstance(PagedList, result);
    } else {
      return plainToInstance(t, response.Data);
    }
  }
}
