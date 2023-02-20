import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthorizationService } from '../network/request/auth/auth-request.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent {
  disableLogin: boolean = false;

  formGroup = new FormGroup({});
  constructor(
    private _authorizationService: AuthorizationService,
    private _router: Router
  ) {}
  login() {
    this._authorizationService.login('test01', 'test01');
  }
  forgetPassword() {}
}
