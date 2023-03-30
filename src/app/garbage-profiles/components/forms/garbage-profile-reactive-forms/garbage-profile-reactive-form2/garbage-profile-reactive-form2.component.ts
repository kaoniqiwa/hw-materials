import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  Output,
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
import { Medium } from 'src/app/common/tools/medium';
import { FormState } from 'src/app/enum/form-state.enum';
import { GarbageStationFunction } from 'src/app/enum/garbage-station-function.enum';
import { StrongCurrentWireMode } from 'src/app/enum/strong-current-wire-mode.enum';
import { YesOrNo } from 'src/app/enum/yes-or-no.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-source.tool';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { MaterialItem } from 'src/app/network/entity/material-item.enitty';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import { PartialResult } from 'src/app/network/entity/partial-result.entity';
import { Property } from 'src/app/network/entity/property.entity';
import { PartialRequest } from 'src/app/network/request/garbage-profiles/garbage-station-profiles/garbage-station-profiles.params';
import { PutOutMaterialsParams } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';
import { Modification } from '../../../../../common/components/modification-confirm/modification-confirm.model';
import { FormStatusCode } from '../garbage-profile-reactive-form/garbage-profile-reactive-form.model';
import { GarbageProfileReactiveForm2Business } from './garbage-profile-reactive-form2.business';

@Component({
  selector: 'garbage-profile-reactive-form2',
  templateUrl: './garbage-profile-reactive-form2.component.html',
  styleUrls: ['./garbage-profile-reactive-form2.component.less'],
  providers: [GarbageProfileReactiveForm2Business],
})
export class GarbageProfileReactiveForm2Component {
  @Input()
  formId?: string;
  @Input()
  formState: FormState = FormState.none;
  @Input() maxProfileState = 6;

  @Output() close = new EventEmitter();
  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();
  @Output() recordEvent = new EventEmitter<PartialData>();

  stepIndex = 1;
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

  showPutout = false;
  showRecord = false;
  LFImageUrl = '';
  RFImageUrl = '';
  FImageUrl = '';
  PowerImageUrl = '';
  putOutParams?: PutOutMaterialsParams;

  identityRevealedValidator: ValidatorFn = (
    control: AbstractControl
  ): ValidationErrors | null => {
    const garbagedrop = control.get('garbagedrop');
    const mixedinto = control.get('mixedinto');
    const garbagefull = control.get('garbagefull');

    if (garbagedrop && mixedinto && garbagefull) {
      if (garbagedrop.value || mixedinto.value || garbagefull.value) {
        return null;
      }
    }
    return { identityRevealed: true };
  };
  formGroup = new FormGroup<{ [key: string]: AbstractControl<any> }>({
    GarbageStationName: new FormControl('', Validators.required),
    CommunityName: new FormControl('', Validators.required),
    StrongCurrentWire: new FormControl(YesOrNo.no, Validators.required),
    LFImageUrl: new FormControl(''),
    RFImageUrl: new FormControl(''),
    FImageUrl: new FormControl(''),
    PowerImageUrl: new FormControl(''),
    Functions: new FormGroup(
      {
        garbagedrop: new FormControl(false),
        mixedinto: new FormControl(false),
        garbagefull: new FormControl(false),
      },
      {
        validators: this.identityRevealedValidator,
      }
    ),
    GarbageStationType: new FormControl(2, Validators.required),
    Remarks: new FormControl(''),
  });

  constructor(
    public sourceTool: GarbageStationProfilesSourceTools,
    public languageTool: GarbageStationProfilesLanguageTools,
    private _toastrService: ToastrService,
    private _changeDetector: ChangeDetectorRef,
    private _business: GarbageProfileReactiveForm2Business
  ) {}

  ngOnInit(): void {
    this._init();
  }

  clickPrev() {
    this.previous.emit();
  }

  async clickSave() {
    this.clickMode = 'save';

    // 检测数据
    if (this._updatePartialData()) {
      if (this.willBeUpdated) {
        // 需要更新partialData
        if (this.hasBeenModified) {
          // 修改信息,走弹窗
          this.showModify = true;
        } else {
          // 创建信息，直接发送
          if (await this._sendData()) {
            this.close.emit();
          }
        }
      } else {
        // 没有更新表单字段，但是有出库
        if (this.putOutParams) {
          if (await this._sendData()) {
            this.close.emit();
          }
        } else {
          this._toastrService.success('无数据更新');
          this.close.emit();
        }
      }
    } else {
      // 验证失败
    }
  }
  async clickNext() {
    this.clickMode = 'next';
    if (this._updatePartialData()) {
      if (this.willBeUpdated) {
        // 需要更新partialData
        if (this.hasBeenModified) {
          // 修改信息,走弹窗
          this.showModify = true;
        } else {
          // 创建信息，直接发送
          if (await this._sendData()) {
            this.next.emit();
          } else {
            if (this.partialData) {
              this.partialData['ProfileState'] = this.profileState;
            }
          }
        }
      } else {
        // 没有更新表单字段，但是有出库
        if (this.putOutParams) {
          if (await this._sendData()) {
            this.next.emit();
          }
        } else {
          this._toastrService.success('无数据更新');
          this.next.emit();
        }
      }
    } else {
      // 验证失败
    }
  }
  async clickConfirm(modification: Modification) {
    this.partialRequest.ModificationReason = modification.reason;
    this.partialRequest.ModificationContent = modification.content;

    if (await this._sendData()) {
      if (this.clickMode == 'save') {
        this.close.emit();
      } else if ((this.clickMode = 'next')) {
        this.next.emit();
      }
    }
  }
  clickCancel() {
    this.showModify = false;
    // this.putOutParams = void 0;
  }
  changeCurrentWire() {
    this._updateValidator(!!this.formGroup.value['StrongCurrentWire']);
  }

  uploadLFImage(id: string) {
    this.formGroup.patchValue({
      LFImageUrl: id,
    });
  }
  uploadRFImage(id: string) {
    this.formGroup.patchValue({
      RFImageUrl: id,
    });
  }
  uploadFImage(id: string) {
    this.formGroup.patchValue({
      FImageUrl: id,
    });
  }
  uploadPowerImage(id: string) {
    this.formGroup.patchValue({
      PowerImageUrl: id,
    });
  }
  clickRecord() {
    if (this.partialData) {
      if (this.partialData['MaterialItems']) {
        this.recordEvent.emit(this.partialData);
      }
    }
  }
  private async _sendData() {
    if (this.putOutParams) {
      let res = await this._putoutMaterial(this.putOutParams);
      if (res) {
        this._toastrService.success('出库成功');
      } else {
        this._toastrService.error('出库失败');
      }
    }
    let res2 = await this._business.updatePartial(this.partialRequest);
    if (res2.Succeed) {
      this._toastrService.success('更新成功');

      return true;
    } else {
      this._toastrService.error('更新失败');
      return false;
    }
  }
  private async _putoutMaterial(params: PutOutMaterialsParams) {
    if (this.partialData) {
      params.ProfileId = this.formId;
      let res = await this._business.putout(params);
      if (res) {
        let newItems = res.MaterialItems;
        let oldItems = _.cloneDeep(
          this.partialData['MaterialItems'] as MaterialItem[]
        );
        newItems.forEach((item) => {
          let findItem = oldItems.find((oldItem) => oldItem.Id == item.Id);
          if (findItem) {
            findItem.Number += item.Number;
          } else {
            oldItems.push(item);
          }
        });
        this.partialData['MaterialItems'] = oldItems;
        // 出库完成后清空
        this.putOutParams = void 0;
        return res;
      } else {
        this._toastrService.error('出库失败');
        return null;
      }
    }
    return null;
  }
  async okHandler(params: PutOutMaterialsParams) {
    this.showPutout = false;

    this.putOutParams = params;
  }
  cancelHandler() {
    this.showPutout = false;
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

          let newData = _.cloneDeep(this.formGroup.value);
          for (let [key, value] of Object.entries(newData)) {
            if (value != void 0 && value !== '' && value !== null) {
              Reflect.set(this.partialData, key, value);
            }
          }
          this.partialData['Functions'] = [];

          if (this.formGroup.value['Functions'].garbagedrop) {
            this.partialData['Functions'].push(
              GarbageStationFunction.garbagedrop
            );
          }
          if (this.formGroup.value['Functions'].mixedinto) {
            this.partialData['Functions'].push(
              GarbageStationFunction.mixedinto
            );
          }
          if (this.formGroup.value['Functions'].garbagefull) {
            this.partialData['Functions'].push(
              GarbageStationFunction.garbagefull
            );
          }
        } else {
          this.willBeUpdated = false;
          this.hasBeenModified = false;
          this.partialRequest.ModificationReason = '';
          this.partialRequest.ModificationContent = '';

          let oldData = _.cloneDeep(this.partialData);
          let newData = _.cloneDeep(this.formGroup.value);
          newData['Functions'] = [];

          if (this.formGroup.value['Functions'].garbagedrop) {
            newData['Functions'].push(GarbageStationFunction.garbagedrop);
          }
          if (this.formGroup.value['Functions'].mixedinto) {
            newData['Functions'].push(GarbageStationFunction.mixedinto);
          }
          if (this.formGroup.value['Functions'].garbagefull) {
            newData['Functions'].push(GarbageStationFunction.garbagefull);
          }
          for (let [key, value] of Object.entries(newData)) {
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

      let functionGroup = this.formGroup.get('Functions')!;
      functionGroup.setValue({
        garbagedrop: false,
        mixedinto: false,
        garbagefull: false,
      });
      (this.partialData['Functions'] as Array<any>).forEach((v) => {
        if (v == GarbageStationFunction.garbagedrop) {
          functionGroup.patchValue({
            garbagedrop: true,
          });
        }
        if (v == GarbageStationFunction.mixedinto) {
          functionGroup.patchValue({
            mixedinto: true,
          });
        }
        if (v == GarbageStationFunction.garbagefull) {
          functionGroup.patchValue({
            garbagefull: true,
          });
        }
      });
      if (this.partialData['StrongCurrentWire'] == YesOrNo.yes) {
        this.changeCurrentWire();

        this.formGroup.patchValue({
          StrongCurrentWireMode: this.partialData['StrongCurrentWireMode'],
          StrongCurrentWireLength: this.partialData['StrongCurrentWireLength'],
        });
      }
      if (this.partialData['LFImageUrl']) {
        this.LFImageUrl = Medium.jpg(this.partialData['LFImageUrl']);
      }

      if (this.partialData['RFImageUrl']) {
        this.RFImageUrl = Medium.jpg(this.partialData['RFImageUrl']);
      }
      if (this.partialData['FImageUrl']) {
        this.FImageUrl = Medium.jpg(this.partialData['FImageUrl']);
      }
      if (this.partialData['PowerImageUrl']) {
        this.PowerImageUrl = Medium.jpg(this.partialData['PowerImageUrl']);
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
  private _updateValidator(value: boolean) {
    if (value) {
      this.formGroup.addControl(
        'StrongCurrentWireMode',
        new FormControl(StrongCurrentWireMode.overheadline, Validators.required)
      );
      this.formGroup.addControl(
        'StrongCurrentWireLength',
        new FormControl('', Validators.required)
      );
    } else {
      this.formGroup.removeControl('StrongCurrentWireMode');
      this.formGroup.removeControl('StrongCurrentWireLength');
    }
  }
}
