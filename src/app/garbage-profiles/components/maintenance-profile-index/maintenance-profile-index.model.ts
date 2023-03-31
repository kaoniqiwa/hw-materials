import { ProfileStateStatisticItem } from 'src/app/network/entity/profile-state-statistic-item.entity';

export class MaintenanceProfileIndexModel {
  profiles: ProfileStateStatisticItem[] = [];
  profileCount: number = 0;
}
export class ConstructionStateStatisticItem {
  /**	Int32	状态	M */
  ConstructionState!: number;
  /**	Int32	数量	M */
  Number!: number;
}
