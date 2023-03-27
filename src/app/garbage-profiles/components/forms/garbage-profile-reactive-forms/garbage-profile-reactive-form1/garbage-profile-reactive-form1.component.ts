import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';
import { CommonFlatNode } from 'src/app/common/components/common-tree/common-flat-node.model';
import { ValidPhoneExp } from 'src/app/common/tools/tool';
import { DivisionLevel } from 'src/app/enum/division-level.enum';
import { EnumHelper } from 'src/app/enum/enum-helper';
import { GarbageStationProfilesLanguageTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-language.tool';
import { GarbageStationProfilesSourceTools } from 'src/app/garbage-profiles/tools/garbage-station-profile-source.tool';
import { Division } from 'src/app/network/entity/division.entity';
import { DivisionInfo } from '../../utils/division/division.model';
import { DivisionUtil } from '../../utils/division/division.util';
import { GarbageProfileReactiveForm } from '../garbage-profile-reactive-form/garbage-profile-reactive-form.component';
import { GarbageProfileReactiveForm1Business } from './garbage-profile-reactive-form1.business';

@Component({
  selector: 'garbage-profile-reactive-form1',
  templateUrl: './garbage-profile-reactive-form1.component.html',
  styleUrls: ['./garbage-profile-reactive-form1.component.less'],
  providers: [GarbageProfileReactiveForm1Business],
})
export class GarbageProfileReactiveForm1Component
  extends GarbageProfileReactiveForm
  implements OnInit
{
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

  override formGroup = new FormGroup<{ [key: string]: AbstractControl<any> }>({
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
    protected override _business: GarbageProfileReactiveForm1Business,
    protected override _toastrService: ToastrService,
    protected override sourceTool: GarbageStationProfilesSourceTools,
    protected override languageTool: GarbageStationProfilesLanguageTools,
    protected _divisionUtil: DivisionUtil,
    protected _changeDetector: ChangeDetectorRef
  ) {
    super(_business, _toastrService, sourceTool, languageTool);

    this.filteredOption = this.Committee.valueChanges.pipe(
      startWith(''),
      map((value) => {
        return this._filterValue(value);
      })
    );
    this._divisionUtil.behaviorSubject.subscribe((data) => {
      console.log('change data', data);

      this.divisionInfo = data;

      // 数据加载完成，触发一次 valueChange
      this.Committee.updateValueAndValidity();
    });
  }

  ngOnInit(): void {
    console.log(this.profileState);
    this._init();
    this._getDivisionInfo();
  }

  private async _init() {}
  selectTreeNode(nodes: CommonFlatNode[]) {
    this.selectedNodes = nodes;
    let ids = this.selectedNodes.map((n) => parseInt(n.Id));
    this.formGroup.patchValue({
      Labels: ids,
    });
  }
  changeDivision(selectEle: HTMLSelectElement, level: DivisionLevel) {
    console.log('change division');
    let selectedOption = selectEle.options[selectEle.selectedIndex];
    let id = selectedOption.id;

    // 清空下级
    this._resetSelect(level);

    // 更新表单视图绑定,否则下拉框默认数据第一项
    this._changeDetector.detectChanges();

    this.divisionSource.set(
      DivisionLevel.Province,
      Reflect.get(this.formGroup.value, 'Province')
    );
    this.divisionSource.set(
      DivisionLevel.City,
      Reflect.get(this.formGroup.value, 'City')
    );
    this.divisionSource.set(
      DivisionLevel.County,
      Reflect.get(this.formGroup.value, 'County')
    );
    this.divisionSource.set(
      DivisionLevel.Street,
      Reflect.get(this.formGroup.value, 'Street')
    );
    this.divisionSource.set(
      DivisionLevel.Committee,
      Reflect.get(this.formGroup.value, 'Committee')
    );

    this._getDivisionInfo();
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
  private _getDivisionInfo() {
    this._divisionUtil.getDivisionInfo(this.divisionSource);
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

    console.log('清空下级字段名: ', patchValue);
    this.formGroup.patchValue(patchValue);
  }
}
