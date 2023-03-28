import { formatDate } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { DateTimePickerView } from 'src/app/common/directives/date-time-picker/date-time-picker.directive';
import { FormState } from 'src/app/enum/form-state.enum';
import { YesOrNo } from 'src/app/enum/yes-or-no.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-source.tool';
import { Camera } from 'src/app/network/entity/camera.entity';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { GPSPoint } from 'src/app/network/entity/gps-point.entity';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import { PartialResult } from 'src/app/network/entity/partial-result.entity';
import { Property } from 'src/app/network/entity/property.entity';
import { PartialRequest } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { GarbageProfileReactiveCameras } from '../garbage-profile-reactive-cameras/garbage-profile-reactive-cameras.component';
import { Modification } from '../../../../../common/components/modification-confirm/modification-confirm.model';
import { GarbageProfileReactiveForm4Business } from './garbage-profile-reactive-form4.business';
import { FormStatusCode } from '../garbage-profile-reactive-form/garbage-profile-reactive-form.model';

@Component({
  selector: 'garbage-profile-reactive-form4',
  templateUrl: './garbage-profile-reactive-form4.component.html',
  styleUrls: ['./garbage-profile-reactive-form4.component.less'],
  providers: [GarbageProfileReactiveForm4Business],
})
export class GarbageProfileReactiveForm4Component {
  @Input()
  formId?: string;

  @Input()
  formState: FormState = FormState.none;

  @Input() maxProfileState = 6;

  @Output() close = new EventEmitter();
  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();

  stepIndex = 3;
  profileState = 0;
  FormState = FormState;
  properties: Property[] = [];
  partialData: PartialData | null = null;
  partialRequest = new PartialRequest();
  simpleChanges: Record<string, any> = {};
  willBeUpdated = false;
  hasBeenModified = false;
  showModify = false;
  clickMode = '';
  statusCode = FormStatusCode.None;

  DateTimePickerView = DateTimePickerView;

  @ViewChild(GarbageProfileReactiveCameras)
  dynamicForm?: GarbageProfileReactiveCameras;

  cameras: Camera[] = [];

  formGroup = new FormGroup<{ [key: string]: AbstractControl<any> }>({
    Longitude: new FormControl('121.48941', Validators.required),
    Latitude: new FormControl('31.40527', Validators.required),
    TimeToDump: new FormControl(new Date(), Validators.required),
    IMEI: new FormControl(''),
    IMEICardType: new FormControl(1),
    NB: new FormControl(''),
  });

  constructor(
    public sourceTool: GarbageStationProfilesSourceTools,
    public languageTool: GarbageStationProfilesLanguageTools,
    private _toastrService: ToastrService,
    private _changeDetector: ChangeDetectorRef,
    private _business: GarbageProfileReactiveForm4Business
  ) {}

  ngOnInit(): void {
    this._init();
  }

  clickPrev() {
    this.previous.emit();
  }
  private async sendPartialData() {
    let res: null | PartialResult<any> = null;

    if (this._updatePartialData()) {
      if (this.willBeUpdated) {
        if (this.hasBeenModified) {
          this.showModify = true;
        } else {
          res = await this._business.updatePartial(this.partialRequest);
          if (res) {
            if (res.Succeed) {
              this.statusCode = FormStatusCode.Success;
            } else {
              this.statusCode = FormStatusCode.Failed;
            }
          }
        }
      } else {
        this.statusCode = FormStatusCode.NotModified;
      }
    } else {
      this.statusCode = FormStatusCode.None;
    }
  }
  async clickSave() {
    this.clickMode = 'save';

    await this.sendPartialData();
    switch (this.statusCode) {
      case FormStatusCode.None:
        break;
      case FormStatusCode.Success:
        this._toastrService.success('操作成功');
        this.close.emit();
        break;
      case FormStatusCode.Failed:
        this._toastrService.success('操作失败');
        if (this.partialData) {
          this.partialData['ProfileState'] = this.profileState;
        }
        break;
      case FormStatusCode.NotModified:
        this._toastrService.success('无数据更新');
        this.close.emit();
        break;
    }
  }
  async clickNext() {
    this.clickMode = 'next';
    await this.sendPartialData();
    switch (this.statusCode) {
      case FormStatusCode.None:
        break;
      case FormStatusCode.Success:
        this._toastrService.success('操作成功');
        this.next.emit();
        break;
      case FormStatusCode.Failed:
        this._toastrService.success('操作失败');
        if (this.partialData) {
          this.partialData['ProfileState'] = this.profileState;
        }
        break;
      case FormStatusCode.NotModified:
        this._toastrService.success('无数据更新');
        this.next.emit();
        break;
    }
  }
  async clickConfirm(modification: Modification) {
    this.partialRequest.ModificationReason = modification.reason;
    this.partialRequest.ModificationContent = modification.content;
    let res = await this._business.updatePartial(this.partialRequest);
    console.log(res);
    if (res.Succeed) {
      this._toastrService.success('操作成功');
      if (this.clickMode == 'save') {
        this.close.emit();
      } else if ((this.clickMode = 'next')) {
        this.next.emit(res.Id);
      }
    } else {
      this._toastrService.error('操作失败');
    }
  }

  private async _init() {
    this.properties = await this._business.getPropertyByCategory(
      this.stepIndex + 1
    );

    let extra = await this._business.getPropertyByNames([
      {
        Name: 'ProfileState',
      },
    ]);

    this.properties.push(...extra.flat());
    // console.log(this.properties);

    this.partialData = await this._getPartialData(this.properties);
    console.log(this.partialData);
    if (this.partialData) {
      this.cameras = Reflect.get(this.partialData, 'Cameras');
    }

    this._updateForm();
  }
  private _getPartialData(propertys: Property[]) {
    if (this.formId) {
      let propertyIds = propertys.map((property) => property.Id);
      return this._business.getPartialData(this.formId, propertyIds);
    }
    return null;
  }
  private _updatePartialData() {
    if (this._checkForm() && this.dynamicForm?.checkForm()) {
      if (this.partialData) {
        if (this.partialData['ProfileState'] <= this.stepIndex) {
          ++this.partialData['ProfileState'];
          this.partialRequest.ModificationReason = '新建档案';
          this.partialRequest.ModificationContent = '';
          this.willBeUpdated = true;
          this.hasBeenModified = false;

          let newData = _.cloneDeep(this.formGroup.value);

          newData['Cameras'] = this.dynamicForm.getCameras();
          this.partialData['GPSPoint'] = new GPSPoint();

          for (let [key, value] of Object.entries(newData)) {
            if (value != void 0 && value !== '' && value !== null) {
              if (key == 'Longitude' || key == 'Latitude') {
                this.partialData['GPSPoint'][key] = value;
                continue;
              }
              if (key == 'TimeToDump') {
                this.partialData['TimeToDump'] = formatDate(
                  value as Date,
                  'yyyy-MM-dd',
                  'en'
                );
                continue;
              }
              Reflect.set(this.partialData, key, value);
            }
          }
        } else {
          this.willBeUpdated = false;
          this.hasBeenModified = false;
          this.partialRequest.ModificationReason = '';
          this.partialRequest.ModificationContent = '';

          let oldData = _.cloneDeep(this.partialData);
          let newData = _.cloneDeep(this.formGroup.value);

          this.partialData['Cameras'] = [];
          newData['Cameras'] = this.dynamicForm.getCameras();

          for (let [key, value] of Object.entries(newData)) {
            if (key == 'Longitude' || key == 'Latitude') {
              if (!('GPSPoint' in this.simpleChanges)) {
                let gpsPoint = oldData['GPSPoint'] as GPSPoint;
                if (gpsPoint) {
                  if (gpsPoint[key] != value) {
                    this.simpleChanges['GPSPoint'] = {
                      OldValue: JSON.stringify(gpsPoint),
                      NewValue: JSON.stringify({
                        Longitude: newData['Longitude'],
                        Latitude: newData['Latitude'],
                      } as GPSPoint),
                    };
                    this.partialData['GPSPoint'].Longitude =
                      newData['Longitude'];
                    this.partialData['GPSPoint'].Latitude = newData['Latitude'];
                  }
                } else {
                  this.simpleChanges['GPSPoint'] = {
                    OldValue: JSON.stringify(gpsPoint),
                    NewValue: JSON.stringify({
                      Longitude: newData['Longitude'],
                      Latitude: newData['Latitude'],
                    } as GPSPoint),
                  };
                  this.partialData['GPSPoint'] = new GPSPoint();

                  this.partialData['GPSPoint'].Longitude = newData['Longitude'];
                  this.partialData['GPSPoint'].Latitude = newData['Latitude'];
                }
              }
              continue;
            }
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
                        this.simpleChanges['Cameras' + (i + 1) + '.' + key] = {
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
        console.log(this.partialRequest);
      } else {
        this.willBeUpdated = false;
        this.hasBeenModified = false;
      }
      return true;
    }
    return false;
  }

  private _updateForm() {
    if (this.partialData) {
      let controls = this.formGroup.controls;
      for (let [key, control] of Object.entries(controls)) {
        if (
          Reflect.get(this.partialData, key) != void 0 &&
          Reflect.get(this.partialData, key) !== '' &&
          Reflect.get(this.partialData, key) !== null
        ) {
          // 重新创建对象，比较差异
          this.formGroup.patchValue({
            [key]: _.cloneDeep(Reflect.get(this.partialData, key)),
          });
        }
      }

      if (this.partialData && this.partialData['GPSPoint']) {
        this.formGroup.patchValue({
          Longitude: this.partialData['GPSPoint'].Longitude,
          Latitude: this.partialData['GPSPoint'].Latitude,
        });
      }
    }
  }
  private _checkForm() {
    if (this.formGroup.invalid) {
      for (let [key, control] of Object.entries(this.formGroup.controls)) {
        if (control.invalid) {
          if ('required' in control.errors!) {
            this._toastrService.warning(this.languageTool[key] + '为必选项');
            break;
          }
          if ('maxlength' in control.errors!) {
            this._toastrService.warning(this.languageTool[key] + '长度不对');
            break;
          }
          if ('pattern' in control.errors!) {
            this._toastrService.warning(this.languageTool[key] + '格式不对');
            break;
          }
          if ('identityRevealed' in control.errors!) {
            this._toastrService.warning(
              this.languageTool[key] + '至少选择一项'
            );
            break;
          }
        }
      }
      return false;
    }

    return true;
  }
}
