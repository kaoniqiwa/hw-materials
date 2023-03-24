import { BasicUrl } from '../base.url';

export abstract class ContractsUrl {
  static get basic(): string {
    return `${BasicUrl.garbage_profiles}/Contracts`;
  }
}
