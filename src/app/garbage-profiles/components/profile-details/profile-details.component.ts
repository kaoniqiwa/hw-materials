import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { GarbageStationProfilesSourceTools } from '../../tools/source.tool';
import { GProfileDetailsSourceBusiness } from './profile-details-source.business';
import { ProfileDetailsBusiness } from './profile-details.business';
import { GarbageStationProfileDetailsSource } from './profile-details.model';
import { Guid } from 'src/app/common/tools/guid';
import { FormState } from 'src/app/enum/form-state.enum';
import { FormatWidth, KeyValue } from '@angular/common';
import { MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { GarbageStationProfilesLanguageTools } from '../../tools/language.tool';
@Component({
  selector: 'profile-details',
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.less'],
  providers: [GProfileDetailsSourceBusiness, ProfileDetailsBusiness],
})
export class ProfileDetailsComponent implements OnInit, AfterViewInit {
  FormState = FormState;
  checkArr: boolean[] = [];

  private _model: GarbageStationProfile | null = null;

  formGroup = this._formBuilder.group({
    formArray: this._formBuilder.array([
      this._formBuilder.group({
        ProfileName: ['', Validators.required], //建档名称
        Province: ['上海市', Validators.required], //省
        City: ['市辖区', Validators.required], //市
        County: ['虹口区', Validators.required], //区
        Street: ['江湾镇街道', Validators.required], //街道
        Committee: ['', Validators.required], //居委会
        Address: ['', Validators.required], //地址
        Contact: ['', Validators.required], //联系人，
        ContactPhoneNo: ['', Validators.required], // 联系人电话
      }),
      this._formBuilder.group({
        GarbageStationName: ['', Validators.required],
        CommunityName: ['', Validators.required],
        StrongCurrentWire: ['', Validators.required],
        StrongCurrentWireMode: ['', Validators.required],
        StrongCurrentWireLength: ['', Validators.required],
        LFImageUrl: ['', Validators.required],
        RFImageUrl: ['', Validators.required],
        FImageUrl: ['', Validators.required],
        PowerImageUrl: ['', Validators.required],
        Functions: ['', Validators.required],
        GarbageStationType: ['', Validators.required],
        Remarks: ['', Validators.required],
      }),
      this._formBuilder.group({
        ConstructionContact: ['', Validators.required],
        ConstructionContactPhoneNo: ['', Validators.required],
        ConstructionDate: ['', Validators.required],
      }),
      this._formBuilder.group({
        GPSPoint: ['', Validators.required],
        TimeToDump: ['', Validators.required],
        IMEI: ['', Validators.required],
        NB: ['', Validators.required],
      }),
    ]),
  });
  get formArray() {
    return this.formGroup.get('formArray') as FormArray<FormGroup>;
  }

  enableSaveBtn(formIndex: number) {
    let formGroup = this.formArray.at(formIndex) as FormGroup;

    if (formGroup) {
      return formGroup.valid;
    }
    return false;
  }
  enableNextBtn(formIndex: number) {
    console.log(this.formArray);
    let formGroup = this.formArray.at(formIndex) as FormGroup;

    console.log(formIndex, formGroup);
    if (formGroup) {
      return formGroup.valid;
    }
    return false;
  }

  @Input()
  profileId = '';

  @Input()
  state: FormState = FormState.none;

  @Output() closeDetails = new EventEmitter();

  @ViewChild('stepper') stepper!: MatStepper;

  constructor(
    private _business: ProfileDetailsBusiness,
    private _formBuilder: FormBuilder,
    private _toastrService: ToastrService,
    private _changeDetector: ChangeDetectorRef,
    public language: GarbageStationProfilesLanguageTools,

    public sourceBusiness: GProfileDetailsSourceBusiness,
    public source: GarbageStationProfilesSourceTools
  ) {}
  async ngOnInit() {
    if (this.profileId) {
      this._model = await this._business.getModel(this.profileId);
      console.log(this._model);
    }
    this._updateForm();
  }
  ngAfterViewInit(): void {
    this.checkArr = Array.from(Array(this.stepper.steps.length), () => false);
    console.log(this.checkArr);
  }

  async createInfo() {
    let res = await this._createModel();
    if (res) {
      this._model = res;
      this.closeDetails.emit();
    }
  }
  async saveInfo(formIndex: number) {
    console.log('save info');
    let formGroup = this.formArray.at(formIndex) as FormGroup;
    if (this._model) {
      // for (let key in formGroup.controls) {
      //   this._model[key] =
      // }
      Object.assign(this._model, formGroup.value);
      console.log(this._model);

      let res = await this._business.updateModel(this._model);
      console.log(res);
      if (res) {
        this._toastrService.success('保存成功');
      }
    }
  }
  editInfo(formIndex: number) {
    let formGroup = this.formArray.at(formIndex) as FormGroup;
    formGroup.enable();
  }
  async nextStep() {
    if (this.state == FormState.add) {
      let res = await this._createModel();
      if (res) {
        this._model = res;
        this.state = FormState.edit;
        if (this.stepper.selected) {
          this.stepper.selected.completed = true;
          this.stepper.next();
        }
      }
    } else {
      console.log('sdf');
    }
  }
  prevStep() {
    this.stepper.previous();
  }
  selectionChange(e: StepperSelectionEvent) {
    console.log('selectionChange');
  }
  private async _checkForm(formIndex: number) {
    let formGroup = this.formArray.at(formIndex) as FormGroup;

    if (formGroup) {
      if (formGroup.invalid) {
        Object.keys(formGroup.controls).forEach((name) => {
          const control = formGroup.controls[name];
        });
        for (let key in formGroup.controls) {
          let control = formGroup.controls[key];
          if (control.invalid) {
            this._toastrService.warning('请输入' + (await this.language[key]));
            break;
          }
        }
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  private _updateForm() {
    if (this.state == FormState.add) {
      this.formGroup.enable();
    } else if (this.state == FormState.edit) {
      this.formGroup.disable();

      if (this._model) {
        let profileState = this._model.ProfileState;

        for (let i = 0; i < profileState; i++) {
          // let step = this.stepper.steps.get(i)!;
          // step.completed = true;
          let formGroup = this.formArray.at(0);
          console.log(formGroup);
          for (let key in formGroup.controls) {
            // console.log(key);
            formGroup.patchValue({ [key]: Reflect.get(this._model, key) });
          }
        }
      }
    }
  }

  private async _createModel() {
    let formIndex = 0;
    if (await this._checkForm(formIndex)) {
      let formGroup = this.formArray.at(formIndex) as FormGroup;

      let model = new GarbageStationProfileModel();
      model.Id = Guid.NewGuid().ToString('N');
      model.ProfileName = formGroup.value.ProfileName;
      model.Province = formGroup.value.Province;
      model.City = formGroup.value.City;
      model.County = formGroup.value.County;
      model.Street = formGroup.value.Street;
      model.Committee = formGroup.value.Committee;
      model.Address = formGroup.value.Address;
      model.Contact = formGroup.value.Contact;
      model.ContactPhoneNo = formGroup.value.ContactPhoneNo;
      model.ProfileState = 1;
      let res = await this._business.createModel(model);

      return res;
    }
    return null;
  }
}
