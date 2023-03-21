import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { PropertyCategory } from 'src/app/enum/property-category.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-source.tool';
import { Camera } from 'src/app/network/entity/camera.entity';
import { GarbageProfileDetailsDynamicForm } from '../garbage-profile-details-dynamic/garbage-profile-details-dynamic.component';
import { _GarbageProfileDetailsFormsBase } from '../garbage-profile-details-forms.common';
import { GarbageProfileDetailsForm5Business } from './garbage-profile-details-form5.business';

@Component({
  selector: 'garbage-profile-details-form5',
  templateUrl: './garbage-profile-details-form5.component.html',
  styleUrls: [
    './garbage-profile-details-form5.component.less',
    '../garbage-profile-details.less',
  ],
  providers: [GarbageProfileDetailsForm5Business],
})
export class GarbageProfileDetailsForm5
  extends _GarbageProfileDetailsFormsBase
  implements OnInit, AfterViewInit
{
  @ViewChild(GarbageProfileDetailsDynamicForm)
  dynamicForm?: GarbageProfileDetailsDynamicForm;

  cameras: Camera[] = [];

  constructor(
    override _business: GarbageProfileDetailsForm5Business,
    source: GarbageStationProfilesSourceTools,
    language: GarbageStationProfilesLanguageTools,
    _toastrService: ToastrService
  ) {
    super(_business, _toastrService, source, language);

    // this.formMode = FormMode.ByModel;
  }
  ngOnInit(): void {
    this._init();
  }
  private async _init() {
    await this._initByPartial();

    if (this.partialData) {
      this.cameras = Reflect.get(this.partialData, 'Cameras');
    }
  }

  private async _initByPartial() {
    this.properties = await this.getPropertyByCategory(this.stepIndex + 1);

    let requiredProperties = await this.getPropertyByNames([
      {
        Name: 'ProfileState',
      },
      {
        Name: 'Cameras',
      },
      {
        Name: 'Name',
        Category: PropertyCategory.site,
      },
      {
        Name: 'Model',
        Category: PropertyCategory.site,
      },
      {
        Name: 'SerialNo',
      },
      {
        Name: 'Placement',
      },
    ]);
    console.log(requiredProperties.flat());
    this.properties.push(...requiredProperties.flat());

    console.log(this.properties);

    this.partialData = await this.getPartialData(this.properties);
    console.log('partialData', this.partialData);
    if (this.partialData) {
      this.profileState = this.partialData['ProfileState'];
    }
  }
  ngAfterViewInit(): void {}
  override updatePartial() {
    if (this.checkForm() && this.dynamicForm?.checkForm()) {
      if (this.partialData) {
        if (this.partialData['ProfileState'] <= this.stepIndex) {
          ++this.partialData['ProfileState'];
          this.partialRequest.ModificationReason = '新建档案';
          this.partialRequest.ModificationContent = '';

          this.willBeUpdated = true;
          this.hasBeenModified = false;

          let newData = _.cloneDeep(this.formGroup.value);
          for (let [key, value] of Object.entries(newData)) {
            if (value != void 0 && value !== '' && value !== null) {
              Reflect.set(this.partialData, key, value);
            }
          }

          newData['Cameras'] = this.dynamicForm.getCameras();
        } else {
          this.partialRequest.ModificationReason = '';

          this.partialRequest.ModificationContent = '';

          let oldData = _.cloneDeep(this.partialData);
          let newData = _.cloneDeep(this.formGroup.value);

          this.partialData['Cameras'] = [];

          newData['Cameras'] = this.dynamicForm.getCameras();

          for (let [key, value] of Object.entries(newData)) {
            if (key == 'Cameras') {
              let oldCameras = oldData['Cameras'];
              let newCameras = newData['Cameras'];

              let len = Math.max(oldCameras.length, newCameras.length);
              for (let i = 0; i < len; i++) {
                let newCamera = newCameras[i];
                let oldCamera = oldCameras[i];

                if (oldCamera) {
                  if (newCamera) {
                    this.partialData['Cameras'][i] = newCamera;

                    for (let [key, value] of Object.entries(oldCamera)) {
                      let oldValue = value;
                      let newValue = newCamera[key as keyof Camera];

                      if (
                        JSON.stringify(oldValue) !== JSON.stringify(newValue)
                      ) {
                        this.simpleChanges['Cameras:' + (i + 1) + ':' + key] = {
                          OldValue: oldValue,
                          NewValue: newValue,
                        };

                        this.partialData['Cameras'][i][key] = newValue;
                      }
                    }
                  } else {
                    // 删除摄像机

                    this.simpleChanges['Cameras:' + (i + 1)] = {
                      OldValue: JSON.stringify(oldCamera),
                      NewValue: JSON.stringify({}),
                    };
                  }
                } else {
                  // 新增摄像机
                  this.simpleChanges['Cameras:' + (i + 1)] = {
                    OldValue: JSON.stringify({}),
                    NewValue: JSON.stringify(newCamera),
                  };
                  this.partialData['Cameras'][i] = newCamera;
                }
              }
              continue;
            }
            let newValue = value;
            let oldValue = oldData[key];

            if (value != void 0 && value !== '' && value !== null) {
              if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                this.simpleChanges[key] = {
                  OldValue: oldValue,
                  NewValue: newValue,
                };
                this.partialData[key] = newValue;
              }
            }
          }

          if (Object.keys(this.simpleChanges).length) {
            this.hasBeenModified = true;
            this.willBeUpdated = true;
            this.partialRequest.ModificationContent = JSON.stringify(
              this.simpleChanges
            );
          } else {
            this.hasBeenModified = false;
            this.willBeUpdated = false;
          }
        }
        this.partialRequest.Data = this.partialData;
      } else {
        this.willBeUpdated = false;
        this.hasBeenModified = false;
      }
      console.log(this.simpleChanges);
      console.log(this.partialRequest);
      return true;
    }
    return false;
  }
}
