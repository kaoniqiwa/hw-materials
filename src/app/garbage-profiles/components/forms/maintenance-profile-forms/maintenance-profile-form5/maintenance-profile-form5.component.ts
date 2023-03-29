import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Medium } from 'src/app/common/tools/medium';
import { MaintenanceProfilesLanguageTools } from 'src/app/garbage-profiles/tools/maintenance-profile-language.too';
import { MaintenanceProfilesSourceTools } from 'src/app/garbage-profiles/tools/maintenance-profile-source.tool';
import { MaintenanceProfile } from 'src/app/network/entity/maintenance-profile.entity';
import { PutOutMaterialsParams } from 'src/app/network/request/garbage-profiles/materials/garbage-profiles-materials.param';
import { SubmitMaintenanceProfileParams } from 'src/app/network/request/maintenance-profiles/maintenance-profiles.param';
import { MaintenanceProfileForm5Business } from './maintenance-profile-form5.business';

@Component({
  selector: 'maintenance-profile-form5',
  templateUrl: './maintenance-profile-form5.component.html',
  styleUrls: ['./maintenance-profile-form5.component.less'],
  providers: [MaintenanceProfileForm5Business],
})
export class MaintenanceProfileForm5Component implements OnInit, OnChanges {
  @Input() formId = '';

  @Input()
  params: SubmitMaintenanceProfileParams = new SubmitMaintenanceProfileParams();

  @Output()
  paramsChange = new EventEmitter();

  private _disabled = false;
  @Input()
  get disabled() {
    return this._disabled;
  }
  set disabled(val: boolean) {
    this._disabled = val;
  }
  model?: MaintenanceProfile;
  showPutout = false;
  currentIndex = 0;
  maxLength = 7;
  // 需要有初始图片选择
  imageUrls: Array<string> = Array(1);
  trackFn = (_: number, item: string) => {
    return item;
  };
  constructor(
    public sourceTool: MaintenanceProfilesSourceTools,
    public languageTool: MaintenanceProfilesLanguageTools,
    private _business: MaintenanceProfileForm5Business,
    private _toastrService: ToastrService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
  ngOnInit(): void {
    this._init();
  }
  private async _init() {
    if (this.formId) {
      this.model = await this._business.getMaintenanceModel(this.formId);
      console.log('model', this.model);
      this.params.Repaired = !!this.model.FaultType;
      this.params.FaultType = this.model.FaultType;
      this.params.FaultDescription = this.model.FaultDescription;
      this.params.MaterialItems = this.model.MaterialItems;
      this.params.SceneImageUrls = this.model.SceneImageUrls ?? [];

      // this.params.SceneImageUrls = [
      //   '6423daae0100004920000021',
      //   '6423dae50100004920000022',
      // ];
      // 如果有初始图片，则覆盖
      if (this.params.SceneImageUrls.length) {
        this.imageUrls = this.params.SceneImageUrls.map((url) =>
          Medium.jpg(url)
        );
      }
    } else {
      this.params.Repaired = false;
      this.params.SceneImageUrls = [];
    }
  }
  changeRepaired() {
    if (!this.params.Repaired) {
      this.params.FaultType = void 0;
      this.params.FaultDescription = void 0;
    }
  }

  okHandler(params: PutOutMaterialsParams) {
    this.showPutout = false;

    this.params.MaterialItems = params.MaterialItems;
  }
  cancelHandler() {
    this.showPutout = false;
  }

  addPicture() {
    if (this.imageUrls.length < this.maxLength) {
      this.imageUrls.length++;
      this.currentIndex = this.imageUrls.length - 1;
    }
  }
  deletePicture(index: number, e: Event) {
    e.stopPropagation();
    if (index == this.imageUrls.length - 1) {
      this.params.SceneImageUrls.splice(index, 1);
      this.imageUrls.splice(index, 1);
      if (this.currentIndex == index) {
        this.currentIndex = index - 1;
      }
    } else {
      this._toastrService.warning('请依次删除');
    }
  }
  upload(id: string, index: number) {
    this.params.SceneImageUrls[index] = id;

    this.imageUrls[index] = Medium.jpg(id);
  }
  click() {
    console.log(this.params.SceneImageUrls);
  }
}
