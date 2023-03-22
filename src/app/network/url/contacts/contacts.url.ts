import { BasicUrl } from '../base.url';

export abstract class ContactsUrl {
  static get basic(): string {
    return `${BasicUrl.garbage_profiles}/Contacts`;
  }
}
