import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AxiosError } from 'axios';
import { ToastrService } from 'ngx-toastr';
import { RoutePath } from '../app-routing.path';
import { AuthorizationService } from '../network/request/auth/auth-request.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit {
  disableLogin: boolean = false;
  savePassWord: boolean = false;
  autoLogin: boolean = false;

  formGroup = this._fb.group({
    username: ['', [Validators.required, Validators.maxLength(15)]],
    password: ['', Validators.required],
  });
  constructor(
    private _fb: FormBuilder,
    private _authorizationService: AuthorizationService,
    private _toastrService: ToastrService,
    private _router: Router
  ) {}
  ngOnInit() {
    this.fillForm();
  }
  fillForm() {}
  async login() {
    if (this._checkForm()) {
      this.disableLogin = true;

      try {
        let res = await this._authorizationService.login(
          this.formGroup.value.username ?? '',
          this.formGroup.value.password ?? ''
        );
        this._router.navigateByUrl(RoutePath.garbage_profiles);

        console.log(res);
      } catch (e) {
        if (this._isAxiosError(e)) {
          if (e.response?.status == 403 || e.response?.status == 500) {
            this._toastrService.error('账号或密码错误');
          }
        }
      }
      this.disableLogin = false;
    }
  }
  forgetPassword() {}
  private _checkForm() {
    if (this.formGroup.invalid) {
      if (this.formGroup.get('username')?.invalid) {
        this._toastrService.warning('请输入账号');
        return;
      }
      if (this.formGroup.get('password')?.invalid) {
        this._toastrService.warning('请输入密码');
        return;
      }
    }

    return true;
  }
  private _isAxiosError(cadidate: any): cadidate is AxiosError {
    return cadidate.isAxiosError === true;
  }
}
