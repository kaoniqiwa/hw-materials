import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AxiosError } from 'axios';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { RoutePath } from '../app-routing.path';
import { User } from '../network/entity/user.model';
import { AuthorizationService } from '../network/request/auth/auth-request.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
})
export class LoginComponent implements OnInit, OnDestroy {
  disableLogin: boolean = false;
  savePassWord: boolean = false;
  autoLogin: boolean = false;

  formGroup = this._fb.group({
    username: ['', [Validators.required, Validators.maxLength(15)]],
    password: ['', Validators.required],
    storepass: false,
    autologin: false,
  });

  get passControl() {
    return this.formGroup.get('storepass')!;
  }
  get autoControl() {
    return this.formGroup.get('autologin')!;
  }
  passControlSub: Subscription;
  autoControlSub: Subscription;
  constructor(
    private _fb: FormBuilder,
    private _cookieService: CookieService,

    private _authorizationService: AuthorizationService,
    private _toastrService: ToastrService,
    private _router: Router
  ) {
    this.passControlSub = this.passControl.valueChanges.subscribe((val) => {
      console.log('pass control', val);
      if (!val && this.autoControl.value == true) {
        this.autoControl.setValue(val);
      }
    });
    this.autoControlSub = this.autoControl.valueChanges.subscribe((val) => {
      console.log('auto control', val);

      this.passControl.setValue(val);
    });
  }
  ngOnInit() {
    this.fillForm();
  }
  ngOnDestroy(): void {
    this.passControlSub.unsubscribe();
    this.autoControlSub.unsubscribe();
  }
  fillForm() {}
  async login() {
    console.log(this.formGroup.value);
    if (this._checkForm()) {
      this.disableLogin = true;
      try {
        let res = await this._authorizationService.login(
          this.formGroup.value.username ?? '',
          this.formGroup.value.password ?? ''
        );
        if (res instanceof User) {
          // this._storeUserInfo(
          //   this.formGroup.value.username!,
          //   this.formGroup.value.password!
          // );
        }
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
  private _storeUserInfo(username: string, password: string) {
    let options = {
      expires: new Date(Date.now() + 60 * 60 * 1000),
      path: '/',
      secure: false,
    };
    // username
    let prefix = CryptoJS.MD5(
      ((Math.random() * 1e9) | 0).toString(16).padStart(8, '0')
    ).toString();
    let suffix = CryptoJS.MD5(
      ((Math.random() * 1e9) | 0).toString(16).padStart(8, '0')
    ).toString();

    let userName = btoa(prefix + username + suffix);
    this._cookieService.set('username', userName, options);

    //password
    prefix = CryptoJS.MD5(
      ((Math.random() * 1e9) | 0).toString(16).padStart(8, '0')
    ).toString();
    suffix = CryptoJS.MD5(
      ((Math.random() * 1e9) | 0).toString(16).padStart(8, '0')
    ).toString();
    let passWord = btoa(prefix + password + suffix);
    this._cookieService.set('password', passWord, options);
  }
}
