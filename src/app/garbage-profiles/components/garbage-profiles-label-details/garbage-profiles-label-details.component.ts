import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormState } from 'src/app/enum/form-state.enum';
import { LabelModel } from 'src/app/model/label.model';

@Component({
  selector: 'garbage-profiles-label-details',
  templateUrl: './garbage-profiles-label-details.component.html',
  styleUrls: ['./garbage-profiles-label-details.component.less'],
})
export class GarbageProfilesLabelDetailsComponent {
  @Input()
  model?: LabelModel;
  @Output()
  ok: EventEmitter<LabelModel> = new EventEmitter();
  @Output()
  cancel: EventEmitter<void> = new EventEmitter();
  @Input()
  state: FormState = FormState.none;

  FormState = FormState;

  onok() {
    if (this.model) {
      this.ok.emit(this.model);
    }
  }
  oncancel() {
    this.cancel.emit();
  }
}
