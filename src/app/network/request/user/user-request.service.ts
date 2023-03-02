import { Injectable } from '@angular/core';
import { instanceToPlain } from 'class-transformer';
import { firstValueFrom } from 'rxjs';
import { UserConfigType } from 'src/app/enum/user-config-type.enum';
import { Fault } from '../../entity/howell-response.model';
import { PagedList } from '../../entity/page.entity';
import { User } from '../../entity/user.model';
import { UserUrl } from '../../url/user.url';
import {
  BaseRequestService,
  BaseTypeRequestService,
} from '../base-request.service';
import { HowellAuthHttpService } from '../howell-auth-http.service';
import { GetUsersParams } from './user-request.params';

@Injectable({
  providedIn: 'root',
})
export class UserRequestService {
  constructor(_http: HowellAuthHttpService) {
    this.basic = new BaseRequestService(_http);
    this.type = this.basic.type(User);
  }

  private basic: BaseRequestService;
  private type: BaseTypeRequestService<User>;

  get(id: string): Promise<User> {
    let url = UserUrl.item(id);
    return this.type.get(url);
  }
  update(data: User): Promise<Fault> {
    let url = UserUrl.basic();
    return this.basic.put(url, Fault, data);
  }
  create(data: User): Promise<Fault> {
    let url = UserUrl.basic();
    return this.basic.post(url, Fault, data);
  }
  delete(id: string): Promise<Fault> {
    let url = UserUrl.item(id);
    return this.basic.delete(url, Fault);
  }

  list(
    params: GetUsersParams = new GetUsersParams()
  ): Promise<PagedList<User>> {
    let url = UserUrl.list();
    let data = instanceToPlain(params);
    return this.type.paged(url, data);
  }

  private _config?: ConfigService;
  public get config(): ConfigService {
    if (!this._config) {
      this._config = new ConfigService(this.basic);
    }
    return this._config;
  }
}

class ConfigService {
  constructor(private basic: BaseRequestService) {}

  get(userId: string, type: UserConfigType): Promise<any> {
    let url = UserUrl.config(userId).item(type);
    let observable = this.basic.http.get(url);
    return firstValueFrom(observable);
  }

  update<T>(
    userId: string,
    type: UserConfigType,
    base64: string
  ): Promise<Fault> {
    let url = UserUrl.config(userId).item(type);
    let observable = this.basic.http.putBase64String<Fault>(url, base64);
    return firstValueFrom(observable);
  }
}
