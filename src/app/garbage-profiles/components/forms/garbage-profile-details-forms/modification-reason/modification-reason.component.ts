import { Component, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'modification-reason',
  templateUrl: './modification-reason.component.html',
  styleUrls: ['./modification-reason.component.less'],
})
export class ModificationReasonComponent {
  @Output() confirmEvent = new EventEmitter();

  reason = '';

  constructor(protected _toastrService: ToastrService) {}
  confirm() {
    if (this.reason) {
      this.confirmEvent.emit(this.reason);
    } else {
      this._toastrService.warning('请输入修改原因');
    }
  }
}
