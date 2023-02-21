import { Injectable } from '@angular/core';
import { instanceToPlain } from 'class-transformer';
import { Cache } from 'src/app/network/cache/cache';
import { PagedList } from 'src/app/network/entity/page.entity';
import { GarbageProfilesBasicsUrl } from 'src/app/network/url/garbage_profiles/basics/basics.url';
import { Division } from '../../../entity/division.entity';
import {
  BaseRequestService,
  BaseTypeRequestService,
} from '../../base-request.service';
import { HowellAuthHttpService } from '../../howell-auth-http.service';
import { AbstractService } from '../../service.interface';
import { GetGarbageProfilesBasicDivisionsParams } from './garbage-profiles-basics.params';

@Injectable({
  providedIn: 'root',
})
export class GarbageProfilesBasicRequestService {
  private basic: BaseRequestService;

  constructor(_http: HowellAuthHttpService) {
    this.basic = new BaseRequestService(_http);
  }

  private _division?: BasicDivisionRequestService;
  public get division(): BasicDivisionRequestService {
    if (!this._division) {
      this._division = new BasicDivisionRequestService(this.basic);
    }
    return this._division;
  }
}
@Cache(GarbageProfilesBasicsUrl.division.basic(), Division)
class BasicDivisionRequestService extends AbstractService<Division> {
  private type: BaseTypeRequestService<Division>;

  constructor(private basic: BaseRequestService) {
    super();
    this.type = this.basic.type(Division);
  }

  list(
    args: GetGarbageProfilesBasicDivisionsParams = new GetGarbageProfilesBasicDivisionsParams()
  ): Promise<PagedList<Division>> {
    let url = GarbageProfilesBasicsUrl.division.list();
    let plain = instanceToPlain(args);
    return this.type.paged(url, plain);
  }
  get(id: string): Promise<Division> {
    let url = GarbageProfilesBasicsUrl.division.item(id);
    return this.type.get(url);
  }
  update(instance: Division): Promise<Division> {
    let url = GarbageProfilesBasicsUrl.division.item(instance.Id);
    let plain = instanceToPlain(instance);
    return this.type.put(url, plain as Division);
  }
  delete(id: string): Promise<Division> {
    let url = GarbageProfilesBasicsUrl.division.item(id);
    return this.type.delete(url);
  }
}
