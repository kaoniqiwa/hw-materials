import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormState } from 'src/app/enum/form-state.enum';
import { GarbageStationProfile } from 'src/app/network/entity/garbage-station-profile.entity';
import { ProfileDetailsBusiness } from './garbage-profile-details-manager.business';

@Component({
  selector: 'garbage-profile-details-manager',
  templateUrl: './garbage-profile-details-manager.component.html',
  styleUrls: ['./garbage-profile-details-manager.component.less'],
  providers: [
    {
      provide: ProfileDetailsBusiness,
      useClass: ProfileDetailsBusiness,
    },
  ],
})
export class GarbageProfileDetailsManager implements OnInit, AfterViewInit {
  @Input()
  formId?: string;

  @Input()
  jumpState = 0;

  @Input()
  state: FormState = FormState.none;

  private _selectedIndex = 0;
  @Input()
  get selectedIndex() {
    return this._selectedIndex;
  }
  set selectedIndex(index: number) {
    this._selectedIndex = index;
  }

  @Output() closeDetails = new EventEmitter();

  @ViewChild('stepperTemp') stepperTemp?: TemplateRef<any>;
  @ViewChild('expansionTemp') expansionTemp?: TemplateRef<any>;
  @ViewChildren('step') stepList?: QueryList<TemplateRef<any>>;

  private _model: GarbageStationProfile | null = null;

  templateExpression: TemplateRef<any> | null = null;
  profileState = 0;
  labels = ['初建档案', '勘察完成', '安装完成', '现场调试'];
  stepLength = this.labels.length;
  completedArr: boolean[] = Array.from(Array(this.stepLength), () => false);

  getTemplate(index: number) {
    return this.stepList ? this.stepList.get(index) ?? null : null;
  }
  constructor(
    private _changeDetector: ChangeDetectorRef,
    private _business: ProfileDetailsBusiness
  ) {}

  ngOnInit(): void {
    this._init();
  }

  private async _init() {
    this._getModel();
  }
  ngAfterViewInit(): void {
    if (this.stepperTemp) {
      this.templateExpression = this.stepperTemp;
    }

    this._changeDetector.detectChanges();
  }
  closeEvent() {
    this.closeDetails.emit();
  }
  nextEvent(index: number) {
    console.log('下一步', index);
    let nextIndex = ++index;
    this.selectedIndex = Math.min(nextIndex, this.stepLength - 1);
  }

  private async _getModel() {
    if (this.formId) {
      this._model = await this._business.getModel(this.formId);
    }
    this._updateProfileState();
    this._setcompletedArr();
  }
  private _setcompletedArr() {
    this.completedArr = this.completedArr.map((v, i) => {
      return i < this.profileState;
    });
    console.log(this.completedArr);
  }
  private _updateProfileState() {
    this.profileState = this._model ? this._model.ProfileState : 0;
  }
}
