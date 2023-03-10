import { ValueNamePair } from '../network/entity/value-name-pair.entity';

export class ValueNamePairModel extends ValueNamePair {
  get Id() {
    return this.Value.toString();
  }
}
