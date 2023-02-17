import { GarbageStationProfile } from '../network/entity/garbage-station-profile.entity';

export class GarbageStationProfileModel extends GarbageStationProfile {
  LFImage?: Promise<string>;
  RFImage?: Promise<string>;
  FImage?: Promise<string>;
  PowerImage?: Promise<string>;
}
