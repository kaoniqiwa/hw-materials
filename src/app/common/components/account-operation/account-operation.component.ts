import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { GlobalStorageService } from 'src/app/common/service/global-storage.service';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { SessionStorageService } from 'src/app/common/service/session-storage.service';
import { AccountOperationDisplay } from './account-operation.model';

@Component({
  selector: 'app-account-operation',
  templateUrl: './account-operation.component.html',
  styleUrls: ['./account-operation.component.less'],
})
export class AccountOperationComponent implements OnInit {
  @Output()
  changePassword: EventEmitter<void> = new EventEmitter();
  @Output()
  bindMobile: EventEmitter<void> = new EventEmitter();

  constructor(
    private _sessionStorageService: SessionStorageService,
    private _localStorageService: LocalStorageService,
    private _store: GlobalStorageService,
    private _cookieService: CookieService,
    private _router: Router
  ) {}

  userName: string = '';
  display = new AccountOperationDisplay();

  ngOnInit(): void {
    let username = this._cookieService.get('username');
    if (!username) {
      // this._router.navigateByUrl(RoutePath.login);
      return;
    }
    username = atob(username);

    let res = username.match(
      /[a-zA-Z0-9+/=]{32}(?<username>\w*)[a-zA-Z0-9+/=]{32}/
    )!;

    username = res.groups!['username'];

    this.userName = username;
  }
  logoutHandler() {
    this._sessionStorageService.clear();
    this._localStorageService.clear();

    this._router.navigateByUrl('/login');

    // if (this._cookieService.check('savePassWord')) {
    //   let savePassWord = JSON.parse(this._cookieService.get('savePassWord'));
    //   if (!savePassWord) {
    //     this._cookieService.deleteAll('/');
    //   }
    // }
  }
  navigateToHelp() {
    window.open('http://garbage01.51hws.com/help/help.html');
  }
  onpasswordchang(event: Event) {
    this.changePassword.emit();
  }
  onmobilebind(event: Event) {
    this.bindMobile.emit();
  }
}
