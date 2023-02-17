import { PagedList } from '../entity/page.entity';
import { IParams, PagedParams } from '../request/IParams.interface';
import { IData, IService } from '../request/service.interface';
import { AppCache } from './app-cache';

export class ServicePool {
  static [key: string]: AppCache;
}

export interface IServiceCache {
  cache: AppCache;
}

export class ServiceCache<T extends IData> implements IServiceCache {
  cache: AppCache;
  loaded = false;
  loading = false;

  constructor(
    protected key: string,
    protected service: IService<T>,
    private timeout = 1000 * 60 * 30,
    private init = true
  ) {
    try {
      // console.log(key);
      let cache = ServicePool[key];
      if (!cache) {
        cache = new AppCache(timeout);
        ServicePool[key] = cache;
      }
      this.cache = cache;
    } catch (error) {
      console.error(error);
    }
    this.cache = new AppCache(timeout);
  }

  private doTimeout(time: number) {
    setTimeout(() => {
      this.loaded = false;
    }, time);
  }

  protected wait(reject: (t: T[]) => void, timeout = 1) {
    setTimeout(() => {
      if (this.loaded) {
        let data = this.load();
        if (!data) {
          if (!this.loading) {
            if (this.init) {
              this.all().then(() => {
                this.doTimeout(this.timeout - 1000);
              });
            }
          }
          this.wait(reject, timeout);
          return;
        }
        reject(data);
      } else {
        if (!this.loading) {
          if (this.init) {
            this.all().then(() => {
              this.doTimeout(this.timeout - 1000);
            });
          }
        }
        this.wait(reject, timeout);
      }
    }, timeout);
  }

  load() {
    return this.cache.get(this.key) as T[] | undefined;
  }
  save(data: T[]) {
    this.cache.set(this.key, data);
  }
  clear() {
    this.cache.del(this.key);
  }

  update(data: T): Promise<T> {
    return this.service.update!(data).then((result) => {
      let datas = this.load();
      if (!datas) datas = [];
      let index = datas.findIndex((x) => x.Id === result.Id);
      if (index >= 0) {
        datas[index] = result;
        this.save(datas);
      }
      return result;
    });
  }
  create(data: T): Promise<T> {
    return this.service.create!(data).then((result) => {
      let datas = this.load();
      if (!datas) datas = [];
      datas.push(result);
      this.save(datas);
      return result;
    });
  }
  delete(id: string): Promise<T> {
    return this.service.delete!(id).then((result) => {
      let datas = this.load();
      if (!datas) datas = [];
      let index = datas.findIndex((x) => x.Id == id);
      if (index >= 0) {
        datas.slice(index, 1);
        this.save(datas);
      }
      return result;
    });
  }
  list(args?: IParams): Promise<PagedList<T>> {
    return this.service.list!(args).then((result) => {
      let datas = this.load();
      result.Data.forEach((item) => {
        if (!datas) datas = [];
        let index = datas.findIndex((x) => x.Id === item.Id);
        if (index >= 0) {
          datas[index] = item;
        } else {
          datas.push(item);
        }
      });
      return result;
    });
  }

  async all(): Promise<T[]> {
    this.loading = true;
    let datas = this.load();
    if (datas && datas.length > 0) {
      return datas;
    }
    return this.service.list!().then((x) => {
      try {
        this.save(x.Data);
        return x.Data;
      } finally {
        this.loaded = true;
        this.loading = false;
      }
    });
  }

  async get(id: string): Promise<T> {
    return this.service.get(id).then((x) => {
      let datas = this.load();
      if (!datas) datas = [];
      let index = datas.findIndex((x) => x.Id == id);
      if (index < 0) {
        datas.push(x);
        this.save(datas);
      }
      return x;
    });
  }

  protected getPaged(datas: T[], params?: PagedParams): PagedList<T> {
    let index = 1;
    let size = 999;
    if (params) {
      if (params.PageIndex) {
        index = params.PageIndex;
      }
      if (params.PageSize) {
        size = params.PageSize;
      }
    }
    let count = datas.length;

    let start = (index - 1) * size;
    let paged = datas.splice(start, size);

    let page = {
      PageIndex: index,
      PageSize: size,
      PageCount: Math.ceil(count / size),
      RecordCount: paged.length,
      TotalRecordCount: count,
    };
    return {
      Page: page,
      Data: paged,
    };
  }
}
