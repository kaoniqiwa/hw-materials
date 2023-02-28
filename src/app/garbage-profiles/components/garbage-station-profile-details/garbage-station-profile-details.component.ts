import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { GarbageStationProfileModel } from 'src/app/model/garbage-station-profile.model';
import { GarbageStationProfilesSourceTools } from '../../tools/source.tool';
import { GarbageStationProfileDetailsSourceBusiness } from './garbage-station-profile-details-source.business';
import { GarbageStationProfileDetailsBusiness } from './garbage-station-profile-details.business';
import { GarbageStationProfileDetailsSource } from './garbage-station-profile-details.model';
import { Guid } from 'src/app/common/tools/guid';
import { FormState } from 'src/app/enum/form-state.enum';
import { KeyValue } from '@angular/common';
@Component({
  selector: 'garbage-station-profile-details',
  templateUrl: './garbage-station-profile-details.component.html',
  styleUrls: ['./garbage-station-profile-details.component.less'],
  providers: [
    GarbageStationProfileDetailsSourceBusiness,
    GarbageStationProfileDetailsBusiness,
  ],
})
export class GarbageStationProfileDetailsComponent implements OnInit {
  FormState = FormState;
  Object = Object;

  @Input()
  state: FormState = FormState.none;

  formGroup = this._formBuilder.group({
    formArray: this._formBuilder.array([
      this._formBuilder.group({
        ProfileName: ['', Validators.required], //建档名称
        Province: ['', Validators.required], //省
        City: ['', Validators.required], //市
        County: ['', Validators.required], //区
        Street: ['', Validators.required], //街道
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
    ]),
  });
  customCompare = (
    keyValueA: KeyValue<string, AbstractControl<any, any>>,
    keyValueB: KeyValue<string, AbstractControl<any, any>>
  ): number => {
    return 0;
  };
  get formArray() {
    return this.formGroup.get('formArray') as FormArray<FormGroup>;
  }
  @Input()
  model: GarbageStationProfileModel = new GarbageStationProfileModel();

  constructor(
    private _formBuilder: FormBuilder,
    private _toastrService: ToastrService,
    public sourceBusiness: GarbageStationProfileDetailsSourceBusiness,
    public source: GarbageStationProfilesSourceTools,
    public business: GarbageStationProfileDetailsBusiness
  ) {}
  ngOnInit(): void {
    console.log(this.model);
    // this.sourceBusiness.load(this.model).then((source) => {
    //   this.divisionSource = source;
    // });
    if (this.state == FormState.add) {
    } else if (this.state == FormState.edit) {
      this._updateForm();
    }
  }

  divisionSource: GarbageStationProfileDetailsSource =
    new GarbageStationProfileDetailsSource();

  onchange() {
    this.sourceBusiness.load(this.model).then((source) => {
      this.divisionSource = source;
    });
  }
  async createModel() {
    let formGroup = this.formArray.at(0) as FormGroup;
    if (await this._checkForm(formGroup)) {
      console.log('提交');

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
      let res = await this.business.setData(model);
      console.log(res);
    }
  }

  private async _checkForm(form: FormGroup) {
    if (form.invalid) {
      for (let key in form.controls) {
        let control = form.controls[key];
        if (control.invalid) {
          this._toastrService.warning(
            '请输入' + (await this.source.language[key])
          );
          break;
        }
      }
      return false;
    }
    return true;
  }

  private _updateForm() {
    let groups = this.formArray.controls;
    console.log(groups);

    for (let i = 0; i < groups.length; i++) {
      let formGroup = groups[i];
      let controls = formGroup.controls;
      console.log(controls);
    }
  }
  onok() {}
  oncancel() {}
}
