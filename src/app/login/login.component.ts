import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent {
  constructor(private _router: Router) {}
  login() {
    this._router.navigateByUrl('garbage-profiles');
  }
}
