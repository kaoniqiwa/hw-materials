import { ProfileStateStatisticItem } from 'src/app/network/entity/profile-state-statistic-item.entity';

export class GarbageStationProfileIndexModel {
  profiles: ProfileStateStatisticItem[] = [];
  profileCount: number = 0;
  labels: number = 0;
}
export class GarbageStationProfileIndexManager {
  state?: number;
}
