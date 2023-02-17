/*
 * @Author: pmx
 * @Date: 2022-08-01 13:46:28
 * @Last Modified by: zzl
 * @Last Modified time: 2022-12-15 17:27:36
 */

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
export class AuthorizationService implements CanActivate {
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
    // console.log(route, state);
    let challenge = this._sessionStorageService.challenge;
    let user = this._localStorageService.user;
    let holdCookie = this._cookieService.check('userName');
    // console.log(userResource);
    if (challenge && user && user.Id && holdCookie) {
      return true;
    }

    let url: string = state.url;
    if (url) {
      try {
        let result = await this.login(url);
        if (result instanceof User) {
          return this._router.parseUrl(`/${RoutePath.garbage_system}`);
        }
      } catch (error) {
        return this._router.parseUrl('/login');
      }
    }
    return this._router.parseUrl('/login');
  }
  login(url: string): Promise<User | AxiosResponse<any> | null>;
  login(
    username: string,
    password: string
  ): Promise<User | AxiosResponse<any> | null>;
  login(
    username: string,
    password?: string
  ): Promise<User | AxiosResponse<any> | null> {
    if (password) {
      return this.loginByUsername(username, password);
    } else {
      return this.loginByUrl(username);
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
          this._storeUserInfo(
            result,
            password,
            result.Id,
            result.Resources ?? []
          );
          return result;
        });
      }
      return null;
    });
  }

  private _storeUserInfo(
    user: User,
    password: string,
    userId: string,
    userResource: Array<UserResource>
  ) {
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

  loginByUrl(url: string): Promise<AxiosResponse<any> | User | null> {
    let uri = new HowellUrl(url);
    if (uri.Querys) {
      try {
        let auto = false;
        for (const key in uri.Querys) {
          let lower = key.toLocaleLowerCase();
          let value = uri.Querys[key];
          switch (lower) {
            case 'auth':
              let encode = decodeURIComponent(value);
              let urlParam = base64decode(encode);
              let paramSplit = urlParam.split('&');
              this._username = paramSplit[0];
              this._password = paramSplit[1];
              auto = true;
              break;
            case 'hidetitlebar':
              this._store.HideTitlebar = JSON.parse(value);
              break;
            case 'hidebutton':
              this._store.HideButton = JSON.parse(value);
              break;
            default:
              break;
          }
        }
        if (auto) {
          //this.sessionUser.clear();
        }
      } catch (error) {
        console.error('login by url: query is null');
        throw error;
      }
    }
    return this.login(this._username, this._password);
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
    // const cnonce = Md5.hashStr(
    //   ((Math.random() * 1e9) | 0).toString(16).padStart(8, '0')
    // );
    var cnonce = ('00000000' + Math.random().toString(36).slice(2)).slice(-8);
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

// 用自带的 HttpClient

// async loginByUsername(username: string, password: string) {
//   this._username = username;
//   this._password = password;

//   let res = await this._http.get<User>(UserUrl.login(username), {
//     headers: this._header
//   }).pipe(
//     catchError((error: HttpErrorResponse) => {
//       return this._handlerError(error)
//     }),
//   ).toPromise()
//   if (res)
//     this._storeUserInfo(res, this._password, res?.Id, res?.Resources ?? [])
//   return plainToInstance(User, res);

// }
// private _handlerError(error: HttpErrorResponse) {
//   if (error.status == 403) {
//     let authenticateHeader = error.headers.get('www-authenticate') ?? "";
//     let challenge = this._parseAuthenticateHeader(authenticateHeader);
//     this._sessionStorageService.challenge = challenge
//     let authorization = this._generateChallengeHeader(
//       challenge,
//       'GET',
//       UserUrl.login(this._username)
//     );
//     this._header = this._header.append('Authorization', authorization)
//     return this._http.get<User>(UserUrl.login(this._username), {
//       headers: this._header
//     })
//   }

//   return of(null);
// }
