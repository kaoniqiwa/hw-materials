import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'hw-materials';
  constructor(private _toastrService: ToastrService) {}
  click() {
    this._toastrService.success('成功');
  }
}
