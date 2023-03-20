import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'modification-reason',
  templateUrl: './modification-reason.component.html',
  styleUrls: ['./modification-reason.component.less'],
})
export class ModificationReasonComponent {
  @Output() confirmEvent = new EventEmitter();

  maxLength = 200;
  reason = '';

  constructor(protected _toastrService: ToastrService) {}
  confirm() {
    if (this.reason) {
      this.confirmEvent.emit(this.reason);
    } else {
      this._toastrService.warning('请输入修改原因');
    }
  }
  down(e: KeyboardEvent) {
    let key = e.key.toLocaleLowerCase();

    if (this.reason.length >= this.maxLength) {
      e.preventDefault();
    }
  }
}
