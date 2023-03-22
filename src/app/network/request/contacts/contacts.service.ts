import { Injectable } from '@angular/core';
import { Contact } from '../../entity/contact.entity';
import { ContactsUrl } from '../../url/contacts/contacts.url';
import { BaseRequestService } from '../base-request.service';
import { HowellAuthHttpService } from '../howell-auth-http.service';

@Injectable({
  providedIn: 'root',
})
export class ContactRequestService {
  private basic: BaseRequestService;
  constructor(_http: HowellAuthHttpService) {
    this.basic = new BaseRequestService(_http);
  }

  array() {
    let url = ContactsUrl.basic;
    return this.basic.getArray(url, Contact);
  }
}
