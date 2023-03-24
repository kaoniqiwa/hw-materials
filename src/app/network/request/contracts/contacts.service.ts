import { Injectable } from '@angular/core';
import { Contract } from '../../entity/contact.entity';
import { ContractsUrl } from '../../url/contracts/contracts.url';
import { BaseRequestService } from '../base-request.service';
import { HowellAuthHttpService } from '../howell-auth-http.service';

@Injectable({
  providedIn: 'root',
})
export class ContractsRequestService {
  private basic: BaseRequestService;
  constructor(_http: HowellAuthHttpService) {
    this.basic = new BaseRequestService(_http);
  }

  array() {
    let url = ContractsUrl.basic;
    return this.basic.getArray(url, Contract);
  }
}
