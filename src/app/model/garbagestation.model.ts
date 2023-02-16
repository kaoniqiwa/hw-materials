import { GarbageStationEntity } from '../network/entity/garbage-station.entity';
import { Division } from './division.model';

export class GarbageStation extends GarbageStationEntity {
  Division?: Promise<Division>;
}
