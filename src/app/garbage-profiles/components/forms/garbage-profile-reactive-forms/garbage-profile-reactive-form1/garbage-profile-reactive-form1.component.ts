import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import _ from 'lodash';
import { map, Observable, startWith } from 'rxjs';
import { CommonFlatNode } from 'src/app/common/components/common-tree/common-flat-node.model';
import { ValidPhoneExp } from 'src/app/common/tools/tool';
import { DivisionLevel } from 'src/app/enum/division-level.enum';
import { EnumHelper } from 'src/app/enum/enum-helper';
import { FormState } from 'src/app/enum/form-state.enum';
import { PropertyCategory } from 'src/app/enum/property-category.enum';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-source.tool';
import { Division } from 'src/app/network/entity/division.entity';
import { PartialData } from 'src/app/network/entity/partial-data.interface';
import { Property } from 'src/app/network/entity/property.entity';
import { DivisionInfo } from '../../utils/division/division.model';
import { DivisionUtil } from '../../utils/division/division.util';
import { GarbageProfileReactiveForm1Business } from './garbage-profile-reactive-form1.business';

@Component({
  selector: 'garbage-profile-reactive-form1',
  templateUrl: './garbage-profile-reactive-form1.component.html',
  styleUrls: ['./garbage-profile-reactive-form1.component.less'],
  providers: [GarbageProfileReactiveForm1Business],
})
export class GarbageProfileReactiveForm1Component implements OnInit {
  @Input()
  formId?: string;

  @Input()
  formState: FormState = FormState.none;

  @Input() profileState = 0;

  @Input() maxProfileState = 6;

  @Output() close = new EventEmitter();
  @Output() next = new EventEmitter();
  @Output() previous = new EventEmitter();

  stepIndex = 0;
  FormState = FormState;
  properties: Property[] = [];
  partialData: PartialData | null = null;

  DivisionLevel = DivisionLevel;

  private defaultProvince = '江苏省';
  private defaultCity = '南京市';
  private defaultCounty = '玄武区';
  private defaultStreet = '新街口街道';
  private defaultCommittee = '';

  divisionSource = new Map([
    [DivisionLevel.None, ''],
    [DivisionLevel.Province, this.defaultProvince],
    [DivisionLevel.City, this.defaultCity],
    [DivisionLevel.County, this.defaultCounty],
    [DivisionLevel.Street, this.defaultStreet],
    [DivisionLevel.Committee, this.defaultCommittee],
  ]);

  selectedNodes: CommonFlatNode[] = [];
  defaultIds: number[] = [];
  divisionInfo: DivisionInfo = new DivisionInfo();
  filteredOption: Observable<Division[]>;

  formGroup = new FormGroup<{ [key: string]: AbstractControl<any> }>({
    ProfileName: new FormControl(null, Validators.required),

    Province: new FormControl(this.defaultProvince, Validators.required),
    City: new FormControl(this.defaultCity, Validators.required),
    County: new FormControl(this.defaultCounty, Validators.required),
    Street: new FormControl(this.defaultStreet, Validators.required),
    Committee: new FormControl(this.defaultCommittee, Validators.required),
    Address: new FormControl(null),

    Contact: new FormControl(null),
    ContactPhoneNo: new FormControl(null, Validators.pattern(ValidPhoneExp)),
    Labels: new FormControl([] as Array<number>),
  });
  get Committee() {
    return this.formGroup.get('Committee') as FormControl;
  }

  constructor(
    public sourceTool: GarbageStationProfilesSourceTools,
    public languageTool: GarbageStationProfilesLanguageTools,
    private _business: GarbageProfileReactiveForm1Business,
    private _toastrService: ToastrService,
    private _divisionUtil: DivisionUtil,
    private _changeDetector: ChangeDetectorRef
  ) {
    this.filteredOption = this.Committee.valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this._filterValue(value);
      })
    );
    this._divisionUtil.behaviorSubject.subscribe((data) => {
      // console.log('change data', data);

      this.divisionInfo = data;

      // 数据加载完成，触发一次 valueChange
      this.Committee.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    console.log('profileState', this.profileState);
    console.log('formState', this.formState);

    this._init();
    this._divisionUtil.getChildDivisionListByName(this.divisionSource);
  }

  clickCreate() {
    this.close.emit();
  }
  clickPrev() {
    this.previous.emit();
  }
  clickSave() {
    // this.close.emit();
    console.log(this.formGroup.value);
  }
  clickNext() {
    console.log(this.formGroup.value);
    this._checkForm();

    // this.next.emit();
  }

  selectTreeNode(nodes: CommonFlatNode[]) {
    this.selectedNodes = nodes;
    let ids = this.selectedNodes.map((n) => parseInt(n.Id));
    this.formGroup.patchValue({
      Labels: ids,
    });
  }
  changeDivision(level: DivisionLevel) {
    // 清空下级
    this._resetSelect(level);

    // 更新表单视图绑定,否则下拉框默认数据第一项
    this._changeDetector.detectChanges();

    this._getDivisionInfo(level);
  }

  private async _init() {
    this.properties = await this._business.getPropertyByCategory(
      this.stepIndex + 1
    );

    let extra = await this._business.getPropertyByNames([
      {
        Name: 'Labels',
        Category: PropertyCategory.operating,
      },
    ]);

    this.properties.push(...extra.flat());
    console.log(this.properties);

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

  private _getDivisionInfo(level: DivisionLevel) {
    let curLevel: DivisionLevel | null = level;

    while (curLevel) {
      this.divisionSource.set(
        curLevel,
        Reflect.get(this.formGroup.value, curLevel)
      );

      curLevel = EnumHelper.getDivisionChildLevel(curLevel);
    }
    this._divisionUtil.getChildDivisionListByName(this.divisionSource);
  }
  private _resetSelect(level: DivisionLevel) {
    let patchValue: { [key: string]: any } = {
      Address: '',
    };

    let childLevel = EnumHelper.getDivisionChildLevel(level);

    while (childLevel) {
      patchValue[DivisionLevel[childLevel]] = '';
      this.divisionInfo[DivisionLevel[childLevel]] = [];
      childLevel = EnumHelper.getDivisionChildLevel(childLevel);
    }

    // console.log('清空下级字段名: ', patchValue);
    this.formGroup.patchValue(patchValue);
  }
  private _filterValue(value: string) {
    if (value) {
      let filterValue = value.toLocaleLowerCase();
      return this.divisionInfo.Committee.filter((committee) =>
        committee.Name.toLocaleLowerCase().includes(filterValue)
      );
    } else {
      return this.divisionInfo.Committee.slice();
    }
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

      this.defaultIds = this.partialData['Labels'];
      this._changeDetector.detectChanges();

      this._getDivisionInfo(DivisionLevel.None);
    }
  }
  private _checkForm() {
    console.log(this.formGroup.status);

    if (this.formGroup.invalid) {
      return false;
    }

    return true;
  }
}
