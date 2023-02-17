import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { plainToInstance } from 'class-transformer';
import { CookieService } from 'ngx-cookie-service';
import { RoutePath } from 'src/app/app-routing.path';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { SessionStorageService } from 'src/app/common/service/session-storage.service';
import { GlobalStorageService } from 'src/app/common/service/global-storage.service';
import { UserUrl } from 'src/app/network/url/garbage/user.url';
import { HowellUrl } from 'src/app/view-model/howell-url';
import CryptoJS from 'crypto-js';
import { Md5 } from 'ts-md5';
import { User, UserResource } from '../../model/user.model';
import { DigestResponse } from './digest-response.class';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationServiceModify implements CanActivate {
  private _username: string = '';
  private _password: string = '';
  private _nc: number = 0;
  private _config: AxiosRequestConfig = {};

  constructor(
    private _localStorageService: LocalStorageService,
    private _sessionStorageService: SessionStorageService,

    private _cookieService: CookieService,
    private _router: Router,
    private _store: GlobalStorageService
  ) {
    if (this._cookieService.check('userName')) {
      let userName = this._cookieService.get('userName');
      userName = atob(userName);
      let res = userName.match(
        /[a-zA-Z0-9+/=]{32}(?<userName>[\w.]+)[a-zA-Z0-9+/=]{32}/
      )!;
      userName = res.groups!['userName'];

      this._username = userName;
    }

    if (this._cookieService.check('passWord')) {
      let passWord = this._cookieService.get('passWord');
      passWord = atob(passWord);
      let res2 = passWord.match(
        /[a-zA-Z0-9+/=]{32}(?<passWord>[\w.]+)[a-zA-Z0-9+/=]{32}/
      )!;
      passWord = res2.groups!['passWord'];

      this._password = passWord;
    }
  }

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log(route, state);
    let challenge = this._sessionStorageService.challenge;
    let user = this._localStorageService.user;
    let holdCookie = this._cookieService.check('userName');
    // console.log(userResource);
    if (challenge && user && user.Id && holdCookie) {
      return true;
    }

    // 虹口区: http://localhost:9527/waste-regulation?auth=aG9uZ2tvdXF1JjdiN3h5OWFj&hideTitleBar=false&HideButton=false
    // 广中路: http://localhost:9527/waste-regulation?auth=Z3Vhbmd6aG9uZ2x1Jjh0cGJ5bmp0&hideTitleBar=false&HideButton=false
    // 管理员:   http://localhost:9527/waste-regulation?auth=YWRtaW4maG93ZWxsLm5ldC5jbg==&hideTitleBar=false&HideButton=false

    // http://localhost:9527/aiop/aiop-manage/system-setting/platform/platform-manage
    try {
      let res = await this.loginByUrl(route);
      if (res instanceof User) {
        let url = new URL(state.url, 'http://localhost:9527');
        // new URL(
        //   '/waste-regulation/index?auth=aG9uZ2tvdXF1JjdiN3h5OWFj&hideTitleBar=true&HideButton=false',
        //   'http://localhost:9527'
        // );
        return this._router.navigateByUrl(url.pathname);
        // return this._router.navigateByUrl(state.url);
      } else {
        return this._router.navigateByUrl('/login');
      }
    } catch (error) {
      return this._router.navigateByUrl('/login');
    }
  }

  async loginByUsername(username: string, password: string) {
    this._username = username;
    this._password = password;
    this._config.url = UserUrl.login(username);

    this._config.headers = {
      'X-Webbrowser-Authentication': 'Forbidden',
    };

    return axios(this._config).catch((error: AxiosError) => {
      if (error.response?.status == 403) {
        let headers = error.response.headers;
        let authenticateHeader = Reflect.get(headers, 'www-authenticate');

        // 将 header字符串转成对象
        let challenge = this._parseAuthenticateHeader(authenticateHeader);

        // console.log('challenge', challenge);

        this._config.headers['Authorization'] = this._generateChallengeHeader(
          challenge,
          'GET',
          UserUrl.login(username)
        );
        this._sessionStorageService.challenge = challenge;
        return axios(this._config).then((res: AxiosResponse<User>) => {
          let result = plainToInstance(User, res.data);
          this._storeUserInfo(result, password);
          return result;
        });
      }
      return null;
    });
  }

  private _storeUserInfo(user: User, password: string) {
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

    let userName = btoa(prefix + user.Username + suffix);
    this._cookieService.set('userName', userName, options);

    //password
    prefix = CryptoJS.MD5(
      ((Math.random() * 1e9) | 0).toString(16).padStart(8, '0')
    ).toString();
    suffix = CryptoJS.MD5(
      ((Math.random() * 1e9) | 0).toString(16).padStart(8, '0')
    ).toString();
    let passWord = btoa(prefix + password + suffix);
    this._cookieService.set('passWord', passWord, options);

    this._localStorageService.user = user;
    this._store.password = passWord;
  }

  async loginByUrl(route: ActivatedRouteSnapshot) {
    // 查询参数
    let querys = route.queryParams;
    let keys = Object.keys(querys);

    // 需要将查询参数键名小写化
    let arr: Array<[string, string]> = keys.map((key) => [
      key.toLocaleLowerCase(),
      querys[key],
    ]);

    // 方便查询
    let map: Map<string, any> = new Map(arr);

    if (map.has('hidetitlebar')) {
      this._store.HideTitlebar = JSON.parse(map.get('hidetitlebar'));
    }

    if (map.has('hidebutton')) {
      this._store.HideButton = JSON.parse(map.get('hidebutton'));
    }
    if (map.has('auth')) {
      // 根据新的账号登陆
      let auth = map.get('auth');
      let encode = decodeURIComponent(auth);
      let account = base64decode(encode);
      let paramSplit = account.split('&');
      this._username = paramSplit[0];
      this._password = paramSplit[1];
    } else {
      // 从cookie中获得账号登陆
      if (this._cookieService.check('autoLogin')) {
        let autoLogin = JSON.parse(this._cookieService.get('autoLogin'));
        if (!autoLogin) {
          return Promise.reject(null);
        }
      }
    }
    return this.loginByUsername(this._username, this._password);
  }

  /**
   *  自成一体的函数，可单独提出去使用
   * @param authenticate
   * @returns
   */
  private _parseAuthenticateHeader(authenticate: string): DigestResponse {
    let fields_str = authenticate.replace(/Digest\s/i, '');
    let fields_arr = fields_str.split(',');

    let challenge = new DigestResponse();

    let len = fields_arr.length;
    for (let i = 0; i < len; i++) {
      var values = /([a-zA-Z]+)=\"?([a-zA-Z0-9.@\/\s]+)\"?/.exec(fields_arr[i]);
      if (values) challenge[values[1]] = values[2];
    }
    // console.log(challenge);
    return challenge;
  }
  private _generateChallengeHeader(
    challenge: DigestResponse,
    method: string,
    uri: string
  ) {
    const realm = challenge.realm;
    const nonce = challenge.nonce;

    // 范围:[00000000,ffffffff]
    this._nc++;
    const nc = this._nc.toString(16).padStart(8, '0');

    // 16位随机数
    const cnonce = Md5.hashStr(
      ((Math.random() * 1e9) | 0).toString(16).padStart(8, '0')
    );

    const qop = challenge.qop;

    const opaque = challenge.opaque;

    const hash1 = Md5.hashStr(`${this._username}:${realm}:${this._password}`);

    const hash2 = Md5.hashStr(`${method}:${uri}`);
    const response = Md5.hashStr(
      `${hash1}:${nonce}:${nc}:${cnonce}:${qop}:${hash2}`
    );

    const authHeaders = `Digest username="${this._username}",realm="${realm}",nonce="${nonce}",uri="${uri}",algorithm="MD5",response="${response}",opaque="${opaque}",qop="${qop}",nc="${nc}",cnonce="${cnonce}"`;
    // console.log('authHeaders', authHeaders);
    return authHeaders;
  }
  public generateHttpHeader(method: string, uri: string) {
    let chanllenge = this._sessionStorageService.challenge;
    // console.log(chanllenge);
    const authHeader = this._generateChallengeHeader(chanllenge, method, uri);
    return new HttpHeaders({
      Authorization: authHeader,
      'X-WebBrowser-Authentication': 'Forbidden',
    });
  }
}
