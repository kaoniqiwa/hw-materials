import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { FormState } from 'src/app/enum/form-state.enum';
import { PropertyCategory } from 'src/app/enum/property-category.enum';
import { YesOrNo } from 'src/app/enum/yes-or-no.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-source.tool';
import { Camera } from 'src/app/network/entity/camera.entity';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import { PartialResult } from 'src/app/network/entity/partial-result.entity';
import { Property } from 'src/app/network/entity/property.entity';
import { PartialRequest } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { Modification } from '../../../../../common/components/modification-confirm/modification-confirm.model';
import { FormStatusCode } from '../garbage-profile-reactive-form/garbage-profile-reactive-form.model';
import { GarbageProfileReactiveForm6Business } from './garbage-profile-reactive-form6.business';

@Component({
  selector: 'garbage-profile-reactive-form6',
  templateUrl: './garbage-profile-reactive-form6.component.html',
  styleUrls: ['./garbage-profile-reactive-form6.component.less'],
  providers: [GarbageProfileReactiveForm6Business],
})
export class GarbageProfileReactiveForm6Component {
  @Input()
  formId?: string;

  @Input()
  formState: FormState = FormState.none;

  @Input() maxProfileState = 6;

  @Output() close = new EventEmitter();
  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();

  stepIndex = 5;
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

  cameras: Camera[] = [];
  currentIndex = 0;
  maxLength = 7;

  formGroup = new FormGroup<{ [key: string]: AbstractControl<any> }>({
    BsStationId: new FormControl('', Validators.required),
    Cameras: new FormArray<FormGroup<{ [key: string]: AbstractControl }>>([]),
  });
  get Cameras() {
    return this.formGroup.get('Cameras') as FormArray;
  }
  constructor(
    public sourceTool: GarbageStationProfilesSourceTools,
    public languageTool: GarbageStationProfilesLanguageTools,
    private _toastrService: ToastrService,
    private _changeDetector: ChangeDetectorRef,
    private _business: GarbageProfileReactiveForm6Business
  ) {}

  ngOnInit(): void {
    this._init();
  }

  clickPrev() {
    this.previous.emit();
  }
  async clickSave() {
    this.clickMode = 'save';
    if (this._updatePartialData()) {
      if (this.willBeUpdated) {
        if (this.hasBeenModified) {
          this.showModify = true;
        } else {
          // 创建档案，注意 profileState +1 问题
          let res = await this._business.updatePartial(this.partialRequest);
          console.log(res);
          if (res.Succeed) {
            this._toastrService.success('操作成功');
            this.close.emit();
          } else {
            // 提交前更新了ProfileState,提交失败重置原始值
            if (this.partialData)
              this.partialData['ProfileState'] = this.profileState;
            this._toastrService.success('操作失败');
          }
        }
      } else {
        this._toastrService.success('无数据更新');
        this.close.emit();
      }
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
        this.next.emit();
      }
    } else {
      this._toastrService.error('操作失败');
    }
  }
  addCamera() {
    if (this.Cameras.length < this.maxLength)
      this.Cameras.push(this.newCamera());
  }
  newCamera() {
    return new FormGroup<{ [key: string]: AbstractControl }>({
      Name: new FormControl(
        {
          value: null,
          disabled: true,
        },
        Validators.required
      ),
      Model: new FormControl(null),
      SerialNo: new FormControl(null),
      Placement: new FormControl(null),
      BsCameraId: new FormControl(null, Validators.required),
    });
  }
  private async _init() {
    this.properties = await this._business.getPropertyByCategory(
      this.stepIndex + 1
    );

    let extra = await this._business.getPropertyByNames([
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

    this.properties.push(...extra.flat());
    // console.log(this.properties);

    this.partialData = await this._getPartialData(this.properties);
    // console.log(this.partialData);
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
    if (this._checkForm()) {
      if (this.partialData) {
        if (this.partialData['ProfileState'] <= this.stepIndex) {
          ++this.partialData['ProfileState'];
          this.partialRequest.ModificationReason = '新建档案';
          this.partialRequest.ModificationContent = '';
          this.willBeUpdated = true;
          this.hasBeenModified = false;

          //  包含disabled控件
          let newData = _.cloneDeep(this.formGroup.getRawValue());

          for (let [key, value] of Object.entries(newData)) {
            if (value != void 0 && value !== '' && value !== null) {
              Reflect.set(this.partialData, key, value);
            }
          }
        } else {
          this.willBeUpdated = false;
          this.hasBeenModified = false;
          this.partialRequest.ModificationReason = '';
          this.partialRequest.ModificationContent = '';

          let oldData = _.cloneDeep(this.partialData);
          let newData = _.cloneDeep(this.formGroup.getRawValue());

          for (let [key, value] of Object.entries(newData)) {
            if (key == 'Cameras') {
              let oldCameras = oldData['Cameras'] as Camera[];
              let newCameras = newData['Cameras'] as Camera[];

              let len = oldCameras.length;
              for (let i = 0; i < len; i++) {
                let newCamera = newCameras[i];
                let oldCamera = oldCameras[i];

                for (let [key, value] of Object.entries(newCamera)) {
                  let oldValue = oldCamera[key as keyof Camera];
                  let newValue = value;

                  if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                    this.simpleChanges['Cameras' + (i + 1) + '.' + key] = {
                      OldValue: oldValue,
                      NewValue: newValue,
                    };

                    this.partialData['Cameras'][i][key] = newValue;
                  }
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
      return true;
    }
    return false;
  }

  private _updateForm() {
    if (this.partialData) {
      for (let [key, control] of Object.entries(this.formGroup.controls)) {
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

      if (this.cameras.length) {
        this.Cameras.clear();
        this.cameras.forEach((v) => {
          let camera = this.newCamera();

          for (let [key, control] of Object.entries(camera.controls)) {
            if (
              Reflect.get(v, key) != void 0 &&
              Reflect.get(v, key) !== '' &&
              Reflect.get(v, key) !== null
            ) {
              camera.patchValue({
                [key]: _.cloneDeep(Reflect.get(v, key)),
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
  }
  private _checkForm() {
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
            // 防止抛出一堆错误
            break;
          }
        }

        return false;
      }
    }

    return true;
  }
}
