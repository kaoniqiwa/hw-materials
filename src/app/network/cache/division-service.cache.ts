import { Division } from '../entity/division.entity';
import { PagedList } from '../entity/page.entity';
import { GetGarbageProfilesBasicDivisionsParams } from '../request/garbage-profiles/basics/garbage-profiles-basics.params';
import { IService } from '../request/service.interface';
import { ServiceCache } from './service.cache';

export class DivisionServiceCache extends ServiceCache<Division> {
  constructor(key: string, service: IService<Division>) {
    super(key, service);
  }

  override async get(id: string): Promise<Division> {
    return new Promise((reject) => {
      this.wait((data) => {
        let result = data.find((x) => x.Id === id);
        if (result) {
          reject(result);
          return;
        }
        this.service.get(id).then((x) => {
          let datas = this.load();
          if (!datas) datas = [];
          let index = datas.findIndex((x) => x.Id == id);
          if (index < 0) {
            datas.push(x);
            this.save(datas);
          }
          reject(x);
        });
      });
    });
  }

  override async list(
    args?: GetGarbageProfilesBasicDivisionsParams
  ): Promise<PagedList<Division>> {
    return new Promise((reject) => {
      this.wait((datas: Division[]) => {
        let paged: PagedList<Division>;
        if (args) {
          if (args.ParentId) {
            datas = datas.filter((x) => x.ParentId === args.ParentId);
          }
          if (args.ParentIdIsNull) {
            datas = datas.filter((x) => !x.ParentId);
          }
          if (args.Path) {
            datas = datas.filter((x) => {
              if (x.Path) {
                return x.Path.toLowerCase().includes(args.Path!.toLowerCase());
              }
              return false;
            });
          }
          if (args.Name) {
            datas = datas.filter((x) => x.Name.includes(args.Name!));
          }
          if (args.AbbrName) {
            datas = datas.filter((x) => {
              if (x.AbbrName) {
                return x.AbbrName.toLowerCase().includes(
                  args.AbbrName!.toLowerCase()
                );
              }
              return false;
            });
          }
          if (args.Ids) {
            datas = datas.filter((x) => args.Ids?.includes(x.Id));
          } else {
          }
          paged = this.getPaged(datas, args);
        } else {
          paged = this.getPaged(datas);
        }
        reject(paged);
      });
    });
  }

  getAncestor(ancestorId: string, datas: Division[]) {
    return datas.find((x) => x.Id === ancestorId);
  }

  getAllChildren(ancestorId: string, datas: Division[]) {
    let children = this.getChildren(ancestorId, datas);
    if (children) {
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        let data = this.getAllChildren(child.Id, datas);
        children = [...children, ...data];
      }
    }
    return children;
  }

  getChildren(parentId: string, datas: Division[]) {
    return datas.filter((x) => x.ParentId === parentId);
  }

  getParent(parentId: string, datas: Division[]) {
    return datas.find((x) => x.Id === parentId);
  }
}
