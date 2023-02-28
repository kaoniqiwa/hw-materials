import { MaterialRecord } from '../network/entity/material-record.entity';
import { GarbageStationProfileModel } from './garbage-station-profile.model';

/**	物料库存出入库记录	*/
export class MaterialRecordModel extends MaterialRecord {
  Images?: Promise<string[]>;
  Profile?: Promise<GarbageStationProfileModel>;
  MaterialRecordTypeName?: string;
}
