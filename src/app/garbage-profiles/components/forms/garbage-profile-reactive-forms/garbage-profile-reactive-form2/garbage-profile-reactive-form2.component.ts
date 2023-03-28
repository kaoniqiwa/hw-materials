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
  putOutMaterialsParams?: PutOutMaterialsParams;

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
    MaterialItems: new FormControl([]),
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

    if (this._checkForm()) {
      if (this.putOutMaterialsParams) {
        await this._putoutMaterial(this.putOutMaterialsParams);
      }
    } else {
      return;
    }

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
    if (this._checkForm()) {
      if (this.putOutMaterialsParams) {
        await this._putoutMaterial(this.putOutMaterialsParams);
      }
    } else {
      return;
    }
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
  private async _putoutMaterial(params: PutOutMaterialsParams) {
    if (this.partialData) {
      params.ProfileId = this.formId;
      let res = await this._business.putout(params);
      if (res) {
        let newItems = res.MaterialItems;
        let oldItems = this.formGroup.get('MaterialItems')!
          .value as MaterialItem[];
        newItems.forEach((item) => {
          let findItem = oldItems.find((oldItem) => oldItem.Id == item.Id);
          if (findItem) {
            findItem.Number += item.Number;
          } else {
            oldItems.push(item);
          }
        });
        this.formGroup.get('MaterialItems')!.patchValue(oldItems);
        // 出库完成后清空
        this.putOutMaterialsParams = void 0;
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

    this.putOutMaterialsParams = params;
    if (this.partialData) {
      if (this.partialData['ProfileState'] <= this.stepIndex) {
        // 处于新建档案状态
        console.log('先创建档案信息');
      } else {
        // 处于编辑状态，已经有勘察完成信息
        await this._putoutMaterial(params);
        this.partialData['MaterialItems'] =
          this.formGroup.get('MaterialItems')!.value;

        this.partialRequest.Data = this.partialData;
        let res2 = await this._business.updatePartial(this.partialRequest);
        console.log(res2);
        if (res2) {
          this._toastrService.success('出库成功');
        }
      }
    }
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
    // console.log(this.partialData);

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
