import { ServiceCache } from '../cache/service.cache';
import { PagedList } from '../entity/page.entity';
import { IParams } from './IParams.interface';

export interface IData<T = any> {
  Id: T;
}

export interface IService<T extends IData> {
  cache: ServiceCache<T>;
  get: (id: string) => Promise<T>;
  update?: (data: T) => Promise<T>;
  create?: (data: T) => Promise<T>;
  delete?: (id: string) => Promise<T>;
  list: (args?: IParams) => Promise<PagedList<T>>;
}

export abstract class AbstractService<T extends IData> implements IService<T> {
  abstract list(args?: IParams): Promise<PagedList<T>>;
  abstract get(id: string): Promise<T>;
}
export interface AbstractService<T extends IData> {
  cache: ServiceCache<T>;
}
