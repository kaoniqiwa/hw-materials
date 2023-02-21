import {
  IBusiness,
  IUpdate,
} from 'src/app/common/interfaces/bussiness.interface';
import { IComponent } from 'src/app/common/interfaces/component.interfact';
import { IModel } from 'src/app/common/interfaces/model.interface';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { PagedList } from 'src/app/network/entity/page.entity';

export class GarbageStationProfileTableArgs {
  Name?: string;
}

export interface IGarbageStationProfileTableBusiness
  extends IBusiness<
      PagedList<GarbageStationProfile>,
      PagedList<GarbageStationProfileModel>
    >,
    IUpdate<GarbageStationProfileModel> {}

export interface IGarbageStationProfileTableComponent
  extends IComponent<IModel, PagedList<GarbageStationProfileModel>> {
  business: IGarbageStationProfileTableBusiness;
}
