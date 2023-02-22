import { ModificationRecord } from '../network/entity/modification-record.entity';
import { GarbageStationProfileModel } from './garbage-station-profile.model';

/**	修改记录	*/
export class ModificationRecordModel extends ModificationRecord {
  Profile!: Promise<GarbageStationProfileModel>;
}
