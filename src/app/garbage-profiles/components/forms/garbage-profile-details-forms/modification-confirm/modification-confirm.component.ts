import { Component, EventEmitter, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Modification } from './modification-confirm.model';

@Component({
  selector: 'modification-confirm',
  templateUrl: './modification-confirm.component.html',
  styleUrls: ['./modification-confirm.component.less'],
})
export class ModificationConfirmComponent {
  @Output() confirm: EventEmitter<Modification> = new EventEmitter();
  @Output()
  cancel: EventEmitter<void> = new EventEmitter();

  maxLength = 200;

  model: Modification = new Modification();

  constructor(protected _toastrService: ToastrService) {}
  onconfirm() {
    if (this.model.reason && this.model.content) {
      this.confirm.emit(this.model);
    } else {
      this._toastrService.warning('请输入修改原因和内容');
    }
  }
  oncancel() {
    this.cancel.emit();
  }
  down(e: KeyboardEvent) {
    let key = e.key.toLocaleLowerCase();

    if (this.model.content.length >= this.maxLength) {
      e.preventDefault();
    }
  }
}
