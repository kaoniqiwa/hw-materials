import { FormatWidth } from '@angular/common';
import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ToastRef, ToastrService } from 'ngx-toastr';
import { HowellTouchSpinOptions } from 'src/app/common/directives/touch-spin/touch-spin.class';
import { FormState } from 'src/app/enum/form-state.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/source.tool';
import { Camera } from 'src/app/network/entity/camera.entity';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { FormMode } from '../garbage-profile-details-forms.common';
import { GarbageProfileDetailsDynamicBusiness } from './garbage-profile-details-dynamic.business';

@Component({
  selector: 'garbage-profile-details-dynamic',
  templateUrl: './garbage-profile-details-dynamic.component.html',
  styleUrls: ['./garbage-profile-details-dynamic.component.less'],
  providers: [GarbageProfileDetailsDynamicBusiness],
})
export class GarbageProfileDetailsDynamicForm implements OnInit, OnChanges {
  @Input()
  formId?: string;

  @Input()
  state: FormState = FormState.none;

  @Input() stepIndex = 0;

  @Input() cameras: Camera[] = [];

  formMode = FormMode.ByPartial;

  private model: GarbageStationProfile | null = null;
  placementOptions: HowellTouchSpinOptions = new HowellTouchSpinOptions();
  volumeOptions: HowellTouchSpinOptions = new HowellTouchSpinOptions();

  currentIndex = 0;
  maxLength = 7;
  formGroup = new FormGroup<{ [key: string]: AbstractControl }>({
    Cameras: new FormArray([], {
      validators: [Validators.required, Validators.maxLength(7)],
    }),
  });

  get Cameras() {
    return this.formGroup.get('Cameras') as FormArray;
  }
  constructor(
    public source: GarbageStationProfilesSourceTools,
    public language: GarbageStationProfilesLanguageTools,
    private _business: GarbageProfileDetailsDynamicBusiness,
    private _toastrService: ToastrService
  ) {
    this.placementOptions.min = 1;
    this.placementOptions.max = 20;
    this.volumeOptions.min = 0;
    this.volumeOptions.max = 100;
  }

  ngOnInit(): void {
    this._init();
  }
  ngOnChanges(changes: SimpleChanges): void {
    if ('cameras' in changes) {
      this._init();
    }
  }

  private async _init() {
    this.updateFormByPartial();
  }
  newCamera() {
    return new FormGroup<{ [key: string]: AbstractControl }>({
      Name: new FormControl('', Validators.required),
      Model: new FormControl(1, Validators.required),
      SerialNo: new FormControl('', Validators.required),
      Placement: new FormControl(1, Validators.required),
      AccessServer: new FormControl(1),
      Resolution: new FormControl(1),
      Bitrate: new FormControl(1),
      StorageTime: new FormControl(1),
      ActionEquipment: new FormControl(0),
      AudioOutputState: new FormControl(0),
      AudioVolume: new FormControl(50),
      AIModelType: new FormControl(0),
      BsCameraId: new FormControl(null),
    });
  }
  addCamera() {
    if (this.Cameras.length < this.maxLength)
      this.Cameras.push(this.newCamera());
  }
  deleteCamera(index: number, e: Event) {
    e.stopPropagation();
    if (index == this.Cameras.length - 1) {
      this.Cameras.removeAt(index);
      if (this.currentIndex == index) {
        this.currentIndex = index - 1;
      }
    } else {
      this._toastrService.warning('请依次删除');
    }
  }

  checkForm() {
    // console.log(this.Cameras.errors);
    if (this.Cameras.invalid) {
      if (this.Cameras.errors) {
        if ('required' in this.Cameras.errors!) {
          this._toastrService.warning('至少一个摄像机');

          return false;
        }
        if ('maxlength' in this.Cameras.errors!) {
          this._toastrService.warning(`最大${this.maxLength}个摄像机`);
          return false;
        }
      }

      for (let i = 0; i < this.Cameras.length; i++) {
        let control = this.Cameras.at(i);
        if (control.invalid) {
          this._toastrService.warning(`摄像机${i + 1}信息无效`);
          return false;
        }
      }
    }
    return true;
  }
  getCameras() {
    let cameras: Camera[] = [];

    for (let group of this.Cameras.controls) {
      let camera = new Camera();
      camera.Name = group.value.Name;
      camera.Model = +group.value.Model;
      camera.SerialNo = group.value.SerialNo;
      camera.Placement = +group.value.Placement;
      camera.AccessServer = +group.value.AccessServer;
      camera.Resolution = +group.value.Resolution;
      camera.Bitrate = +group.value.Bitrate;
      camera.StorageTime = +group.value.StorageTime;
      camera.ActionEquipment = +group.value.ActionEquipment;
      camera.AudioOutputState = +group.value.AudioOutputState;
      camera.AudioVolume = +group.value.AudioVolume;
      camera.AIModelType = +group.value.AIModelType;
      camera.BsCameraId = group.value.BsCameraId;
      cameras.push(camera);
    }
    return cameras;
  }

  removeValidators(name: string, validators: ValidatorFn | ValidatorFn[]) {
    for (let group of this.Cameras.controls) {
      let control = group.get(name);
      if (control) {
        control.removeValidators(validators);
      }
    }
  }
  addControl(name: string, validators: ValidatorFn | ValidatorFn[]) {}
  updateFormByPartial() {
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
    }
  }
}
