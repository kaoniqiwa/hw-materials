import { Exclude } from 'class-transformer';
import { MaterialRecord } from '../network/entity/material-record.entity';
import { GarbageStationProfileModel } from './garbage-station-profile.model';

/**	物料库存出入库记录	*/
export class MaterialRecordModel extends MaterialRecord {
  @Exclude()
  Images?: Promise<string[]>;
  @Exclude()
  Profile?: Promise<GarbageStationProfileModel>;
  @Exclude()
  MaterialRecordTypeName?: string;
}
