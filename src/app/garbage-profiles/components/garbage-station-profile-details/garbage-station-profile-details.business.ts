import { IBusiness } from 'src/app/common/interfaces/bussiness.interface';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';

export class GarbageStationProfileDetailsBusiness
  implements IBusiness<GarbageStationProfileModel>
{
  load(...args: any): Promise<GarbageStationProfileModel> {
    throw new Error('Method not implemented.');
  }
  getData(...args: any): Promise<GarbageStationProfileModel> {
    throw new Error('Method not implemented.');
  }
}
