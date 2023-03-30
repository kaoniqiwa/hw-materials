import { Injectable } from '@angular/core';
import { MaintenanceProfileModel } from 'src/app/model/maintenance-profile.model';
import { MaterialItem } from 'src/app/network/entity/material-item.enitty';
import { MaintenanceProfileRequestService } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.service';
import { IConverter } from '../../common/interfaces/converter.interface';
import { PartialData } from '../../network/entity/partial-data.interface';

@Injectable({
  providedIn: 'root',
})
export class MaintenanceProfilePartialDataConverter
  implements IConverter<PartialData, Promise<MaintenanceProfileModel>>
{
  constructor(private service: MaintenanceProfileRequestService) {}

  async convert(source: PartialData): Promise<MaintenanceProfileModel> {
    let model = new MaintenanceProfileModel();
    model.Id = source.Id;

    model.Province = this.getItem<string>(source.Id, 'Province', source);
    model.City = this.getItem<string>(source.Id, 'City', source);
    model.County = this.getItem<string>(source.Id, 'County', source);
    model.Street = this.getItem<string>(source.Id, 'Street', source);
    model.Committee = this.getItem<string>(source.Id, 'Committee', source);
    model.GarbageStationProfileId = this.getItem<string>(
      source.Id,
      'GarbageStationProfileId',
      source
    );
    model.GarbageStationName = this.getItem<string>(
      source.Id,
      'GarbageStationName',
      source
    );
    model.GarbageStationAddress = this.getItem<string>(
      source.Id,
      'GarbageStationAddress',
      source
    );
    model.CreationPersonnel = this.getItem<string>(
      source.Id,
      'CreationPersonnel',
      source
    );
    model.CreationUserId = this.getItem<string>(
      source.Id,
      'CreationUserId',
      source
    );
    model.CreationTime = this.getItem<Date>(source.Id, 'CreationTime', source);
    model.ProfileType = this.getItem<number>(source.Id, 'ProfileType', source);
    model.MaintenanceType = this.getItem<number>(
      source.Id,
      'MaintenanceType',
      source
    );
    model.MaintenanceDescription = this.getItem<string>(
      source.Id,
      'MaintenanceDescription',
      source
    );
    model.Customer = this.getItem<string>(source.Id, 'Customer', source);
    model.CustomerPhoneNo = this.getItem<string>(
      source.Id,
      'CustomerPhoneNo',
      source
    );
    model.FaultDate = this.getItem<Date>(source.Id, 'FaultDate', source);
    model.DistributionPersonnel = this.getItem<string>(
      source.Id,
      'DistributionPersonnel',
      source
    );
    model.DistributionUserId = this.getItem<string>(
      source.Id,
      'DistributionUserId',
      source
    );
    model.DistributionTime = this.getItem<Date>(
      source.Id,
      'DistributionTime',
      source
    );
    model.MaintenancePersonnel = this.getItem<string>(
      source.Id,
      'MaintenancePersonnel',
      source
    );
    model.MaintenanceUserId = this.getItem<string>(
      source.Id,
      'MaintenanceUserId',
      source
    );
    model.MaintenanceDeadline = this.getItem<Date>(
      source.Id,
      'MaintenanceDeadline',
      source
    );
    model.FaultType = this.getItem<number>(source.Id, 'FaultType', source);
    model.FaultDescription = this.getItem<string>(
      source.Id,
      'FaultDescription',
      source
    );
    model.MaterialItems = this.getItem<MaterialItem[]>(
      source.Id,
      'MaterialItems',
      source
    );
    model.MaintenanceTime = this.getItem<Date>(
      source.Id,
      'MaintenanceTime',
      source
    );
    model.SceneImageUrls = this.getItem<string[]>(
      source.Id,
      'SceneImageUrls',
      source
    );
    model.ConstructionState = this.getItem<number>(
      source.Id,
      'ConstructionState',
      source
    );
    model.ConstructionReason = this.getItem<string>(
      source.Id,
      'ConstructionReason',
      source
    );
    model.ConstructionApplicationTime = this.getItem<Date>(
      source.Id,
      'ConstructionApplicationTime',
      source
    );
    model.ConstructionApprovalReason = this.getItem<string>(
      source.Id,
      'ConstructionApprovalReason',
      source
    );
    model.ConstructionApprovalTime = this.getItem<Date>(
      source.Id,
      'ConstructionApprovalTime',
      source
    );
    model.CompletionPersonnel = this.getItem<string>(
      source.Id,
      'CompletionPersonnel',
      source
    );
    model.CompletionUserId = this.getItem<string>(
      source.Id,
      'CompletionUserId',
      source
    );
    model.CompletionTime = this.getItem<Date>(
      source.Id,
      'CompletionTime',
      source
    );
    model.OutOfTime = this.getItem<number>(source.Id, 'OutOfTime', source);
    model.UpdateTime = this.getItem<Date>(source.Id, 'UpdateTime', source);
    model.ProfileState = this.getItem<number>(
      source.Id,
      'ProfileState',
      source
    );

    return model;
  }

  getItem<T>(id: string, key: string, data: PartialData) {
    return new Promise<T>((get) => {
      if (key === 'MaterialItems') {
        debugger;
      }
      if (data[key] !== undefined) {
        get(data[key]);
        return;
      }
      this.service.partialData.get(id, [key]).then((data) => {
        get(data[key]);
      });
    });
  }
}
