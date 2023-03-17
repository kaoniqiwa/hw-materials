import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PropertyCategory } from 'src/app/enum/property-category.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/source.tool';
import { Camera } from 'src/app/network/entity/camera.entity';
import { PartialRequest } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { GarbageProfileDetailsDynamicForm } from '../garbage-profile-details-dynamic/garbage-profile-details-dynamic.component';
import { GarbageProfileDetailFormsBusiness } from '../garbage-profile-details-forms.business';
import {
  FormMode,
  _GarbageProfileDetailsFormsBase,
} from '../garbage-profile-details-forms.common';
import { GarbageProfileDetailsForm6Business } from './garbage-profile-details-form6.business';

@Component({
  selector: 'garbage-profile-details-form6',
  templateUrl: './garbage-profile-details-form6.component.html',
  styleUrls: [
    './garbage-profile-details-form6.component.less',
    '../garbage-profile-details.less',
  ],
  providers: [GarbageProfileDetailsForm6Business],
})
export class GarbageProfileDetailsForm6
  extends _GarbageProfileDetailsFormsBase
  implements OnInit, AfterViewInit
{
  cameras: Camera[] = [];
  currentIndex = 0;
  @ViewChild(GarbageProfileDetailsDynamicForm)
  dynamicForm?: GarbageProfileDetailsDynamicForm;

  override formGroup: FormGroup<any> = new FormGroup({
    BsStationId: new FormControl('', Validators.required),
  });

  constructor(
    override _business: GarbageProfileDetailsForm6Business,
    source: GarbageStationProfilesSourceTools,
    language: GarbageStationProfilesLanguageTools,
    _toastrService: ToastrService
  ) {
    super(_business, _toastrService, source, language);
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

  ngAfterViewInit(): void {
    console.log(this.dynamicForm);
  }
  private async _initByPartial() {
    this.properties = await this.getPropertyByCategory(this.stepIndex + 1);

    let requiredProperties = await this._business.listProperty({
      Name: 'Name',
      Category: PropertyCategory.site,
    });

    this.properties.push(...requiredProperties.flat());
    this.partialData = await this.getPartialData(this.properties);
    console.log('partialData', this.partialData);
  }
  override async updatePartial() {
    if (this.checkForm() && this.dynamicForm?.checkForm()) {
      let willBeUpdated = false;
      let partialRequest = new PartialRequest();

      if (this.partialData) {
        if (this.partialData['ProfileState'] <= this.stepIndex) {
          ++this.partialData['ProfileState'];
          partialRequest.ModificationReason = '新建档案';
          partialRequest.ModificationContent = '';
          willBeUpdated = true;
        } else {
          this.partialRequest.ModificationReason = '';

          this.partialRequest.ModificationContent = '';
          let objData = this.formGroup.value;
          let content: Array<{ Name: string; OldValue: any; NewValue: any }> =
            [];
          for (let [key, value] of Object.entries(objData)) {
            if (value != void 0 && value !== '' && value !== null) {
              let oldValue = Reflect.get(this.partialData, key);
              let newValue = value;
              if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                content.push({
                  Name: key,
                  OldValue: oldValue,
                  NewValue: newValue,
                });
              }
            }
          }
          let newCameras = this.dynamicForm!.getCameras();
          let oldCameras = this.partialData['Cameras'] as Camera[];

          console.group(newCameras, oldCameras);
          for (let i = 0; i < newCameras.length; i++) {
            let newCamera = newCameras[i];
            let oldCamera = oldCameras[i];

            if (oldCamera) {
              for (let [key, value] of Object.entries(oldCamera)) {
                let oldValue = value;
                let newValue = newCamera[key as keyof Camera];

                console.log(key, oldValue, newValue);

                if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                  content.push({
                    Name: 'Camera:' + key,
                    OldValue: oldValue,
                    NewValue: newValue,
                  });
                }
              }
            } else {
              partialRequest.ModificationReason = '添加摄像机';

              content.push({
                Name: 'Camera',
                OldValue: JSON.stringify({}),
                NewValue: JSON.stringify(newCamera),
              });
            }
          }

          if (content.length) {
            willBeUpdated = true;
            partialRequest.ModificationContent = JSON.stringify(content);
          }

          console.log(partialRequest);
        }
        if (willBeUpdated) {
          let objData = this.formGroup.value;
          for (let [key, value] of Object.entries(objData)) {
            if (value != void 0 && value !== '' && value !== null) {
              Reflect.set(this.partialData, key, value);
            }
          }

          let newCameras = this.dynamicForm!.getCameras();
          let oldCameras = this.partialData['Cameras'] as Camera[];

          console.group(newCameras, oldCameras);
          for (let i = 0; i < newCameras.length; i++) {
            let newCamera = newCameras[i];
            let oldCamera = oldCameras[i];

            if (oldCamera) {
              for (let [key, value] of Object.entries(oldCamera)) {
                let oldValue = value;
                let newValue = newCamera[key as keyof Camera];

                console.log(key, oldValue, newValue);

                if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                  Reflect.set(oldCamera, key, newValue);
                }
              }
            } else {
              this.partialData['Cameras'].push(newCamera);
            }
          }

          // this.partialData['Cameras'] = this.dynamicForm?.getCameras() ?? [];
          // let cameras = Reflect.get(this.partialData, 'Cameras') as
          //   | Camera[]
          //   | null;
          // if (cameras && cameras.length) {
          //   let formCameras = this.dynamicForm?.getCameras() ?? [];

          //   cameras.forEach((camera, index) => {
          //     let formCamera = formCameras[index];
          //     if (formCamera) {
          //       Object.assign(camera, formCamera);
          //     }
          //   });
          // }
          partialRequest.Data = this.partialData;

          // let res = await this._business.updatePartial(partialRequest);

          // return res;
        }
      }
    }
    return null;
  }
}
