import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PropertyCategory } from 'src/app/enum/property-category.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-source.tool';
import { Camera } from 'src/app/network/entity/camera.entity';
import { _GarbageProfileDetailsFormsBase } from '../garbage-profile-details-form/garbage-profile-details-forms.common';
import { GarbageProfileDetailsForm6Business } from './garbage-profile-details-form6.business';

@Component({
  selector: 'garbage-profile-details-form6',
  templateUrl: './garbage-profile-details-form6.component.html',
  styleUrls: ['./garbage-profile-details-form6.component.less'],
  providers: [GarbageProfileDetailsForm6Business],
})
export class GarbageProfileDetailsForm6
  extends _GarbageProfileDetailsFormsBase
  implements OnInit
{
  cameras: Camera[] = [];
  currentIndex = 0;
  maxLength = 7;

  override formGroup = new FormGroup({
    BsStationId: new FormControl('', Validators.required),
    Cameras: new FormArray<FormGroup<{ [key: string]: AbstractControl }>>([]),
  });
  get Cameras() {
    return this.formGroup.get('Cameras') as FormArray;
  }
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

    this.updateForm();
    // console.log(this.Cameras.value);
  }
  addCamera() {
    if (this.Cameras.length < this.maxLength)
      this.Cameras.push(this.newCamera());
  }
  newCamera() {
    return new FormGroup<{ [key: string]: AbstractControl }>({
      Name: new FormControl(null, Validators.required),
      Model: new FormControl(null),
      SerialNo: new FormControl(null),
      Placement: new FormControl(null),
      BsCameraId: new FormControl(null, Validators.required),
    });
  }
  private async _initByPartial() {
    this.properties = await this.getPropertyByCategory(this.stepIndex + 1);

    let properties = await this.getPropertyByNames([
      {
        Name: 'ProfileState',
      },
      {
        Name: 'BsStationId',
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

      {
        Name: 'BsCameraId',
      },
    ]);

    this.properties = properties.flat();
    console.log(this.properties);

    this.partialData = await this.getPartialData(this.properties);
    console.log('partialData', this.partialData);
    if (this.partialData) {
      this.profileState = this.partialData['ProfileState'];
    }
  }

  override updateForm() {
    super.updateForm();
    if (this.cameras.length) {
      this.Cameras.clear();
      this.cameras.forEach((v) => {
        let camera = this.newCamera();

        let controls = camera.controls;
        for (let [key, control] of Object.entries(controls)) {
          if (
            Reflect.get(v, key) != void 0 &&
            Reflect.get(v, key) !== '' &&
            Reflect.get(v, key) !== null
          ) {
            camera.patchValue({
              [key]: Reflect.get(v, key),
            });
          }
        }

        this.Cameras.push(camera);
      });
    } else {
      this.Cameras.clear();

      this.addCamera();
    }
  }

  override checkForm() {
    if (this.formGroup.invalid) {
      if (this.formGroup.get('BsStationId')?.invalid) {
        this._toastrService.warning('业务平台厢房ID不能为空');

        return false;
      }
      if (this.Cameras.invalid) {
        for (let i = 0; i < this.Cameras.length; i++) {
          let group = this.Cameras.at(i) as FormGroup;
          if (group.invalid) {
            for (let [key, control] of Object.entries(group.controls)) {
              if (control.invalid) {
                this._toastrService.warning(`摄像机${i + 1} 信息无效`);
                break;
              }
            }
            break;
          }
        }

        return false;
      }
    }
    return true;
  }
}
