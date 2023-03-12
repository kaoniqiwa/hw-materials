import { FormatWidth } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastRef, ToastrService } from 'ngx-toastr';
import { CommonFormInterface } from 'src/app/common/interfaces/common-form.interface';
import { FormState } from 'src/app/enum/form-state.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/source.tool';
import { Camera } from 'src/app/network/entity/camera.entity';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { GarbageProfileDetailsDynamicBusiness } from './garbage-profile-details-dynamic.business';

@Component({
  selector: 'garbage-profile-details-dynamic',
  templateUrl: './garbage-profile-details-dynamic.component.html',
  styleUrls: ['./garbage-profile-details-dynamic.component.less'],
  providers: [GarbageProfileDetailsDynamicBusiness],
})
export class GarbageProfileDetailsDynamicForm
  implements CommonFormInterface, OnInit
{
  @Input()
  formId?: string;

  @Input()
  state: FormState = FormState.none;

  @Input() stepIndex = 0;

  private model: GarbageStationProfile | null = null;

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
  ) {}
  updateForm(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    console.log(this.stepIndex);
    this._init();
  }

  private async _init() {
    if (this.formId) {
      this.model = await this._business.getModel(this.formId);
    }
    console.log(this.model);

    this._updateForm();
  }
  newCamera() {
    return new FormGroup<{ [key: string]: AbstractControl }>({
      Name: new FormControl('', Validators.required),
      Model: new FormControl(1, Validators.required),
      SerialNo: new FormControl('', Validators.required),
      Placement: new FormControl(1, Validators.required),
      AccessServer: new FormControl(''),
      Resolution: new FormControl(''),
      Bitrate: new FormControl(''),
      StorageTime: new FormControl(''),
      ActionEquipment: new FormControl(''),
      AudioOutputState: new FormControl(''),
      AudioVolume: new FormControl(''),
      AIModelType: new FormControl(''),
      BsCameraId: new FormControl(''),
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

    for (let control of this.Cameras.controls) {
      console.log(control);
      let camera = new Camera();
      camera.Name = control.value.Name;
      camera.Model = control.value.Model;
      camera.SerialNo = control.value.SerialNo;
      camera.Placement = control.value.Placement;
      camera.AccessServer = control.value.AccessServer;
      camera.Resolution = control.value.Resolution;
      camera.Bitrate = control.value.Bitrate;
      camera.StorageTime = control.value.StorageTime;
      camera.ActionEquipment = control.value.ActionEquipment;
      camera.AudioOutputState = control.value.AudioOutputState;
      camera.AudioVolume = control.value.AudioVolume;
      camera.AIModelType = control.value.AIModelType;
      // camera.BsCameraId = control.value.BsCameraId;
      cameras.push(camera);
    }
    return cameras;
  }
  private _updateForm() {
    if (this.state == FormState.edit) {
      if (this.model) {
        if (this.model.Cameras && this.model.Cameras.length > 0) {
          this.Cameras.clear();
          this.model.Cameras?.forEach((v) => {
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

          return;
        }
      }
      this.addCamera();
    }
  }
}
