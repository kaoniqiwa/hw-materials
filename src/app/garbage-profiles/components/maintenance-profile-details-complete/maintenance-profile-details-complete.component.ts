import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MaintenanceProfileDetailsCompleteBusiness } from './maintenance-profile-details-complete.business';

@Component({
  selector: 'maintenance-profile-details-complete',
  templateUrl: './maintenance-profile-details-complete.component.html',
  styleUrls: ['./maintenance-profile-details-complete.component.less'],
  providers: [MaintenanceProfileDetailsCompleteBusiness],
})
export class MaintenanceProfileDetailsCompleteComponent {
  @Input()
  profileId: string = '';
  @Output()
  details: EventEmitter<string> = new EventEmitter();
  @Output()
  ok: EventEmitter<void> = new EventEmitter();
  @Output()
  cancel: EventEmitter<void> = new EventEmitter();
  constructor(
    private business: MaintenanceProfileDetailsCompleteBusiness,
    private toastr: ToastrService
  ) {}
  todetails() {
    if (this.profileId) {
      this.details.emit(this.profileId);
    }
  }
  onsubmit() {
    if (this.profileId) {
      this.business
        .complete(this.profileId)
        .then((x) => {
          this.toastr.success('操作成功');
          this.ok.emit();
        })
        .catch((x) => {
          this.toastr.error('操作失败');
        });
    }
  }
  oncancel() {
    this.cancel.emit();
  }
}
