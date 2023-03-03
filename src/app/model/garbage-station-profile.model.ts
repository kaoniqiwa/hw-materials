import { Exclude } from 'class-transformer';
import { GarbageStationProfile } from '../network/entity/garbage-station-profile.entity';

export class GarbageStationProfileModel extends GarbageStationProfile {
  @Exclude()
  LFImage?: Promise<string>;
  @Exclude()
  RFImage?: Promise<string>;
  @Exclude()
  FImage?: Promise<string>;
  @Exclude()
  PowerImage?: Promise<string>;
  @Exclude()
  ProfileStateName!: Promise<string>;

  [key: string]: any;
}
