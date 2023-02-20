import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RoutePath } from '../app-routing.path';
import { AuthorizationService } from '../network/request/auth/auth-request.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent {
  disableLogin: boolean = false;

  formGroup = this._fb.group({
    username: ['1', [Validators.required, Validators.maxLength(15)]],
    password: ['2', Validators.required],
  });
  constructor(
    private _fb: FormBuilder,
    private _authorizationService: AuthorizationService,
    private _router: Router
  ) {}
  async login() {
    let res = await this._authorizationService.login('test01', 'test01');

    this._router.navigateByUrl(RoutePath.garbage_profiles);
  }
  forgetPassword() {}
}
