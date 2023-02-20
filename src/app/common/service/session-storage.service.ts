/*
 * @Author: pmx
 * @Date: 2021-09-28 13:20:43
 * @Last Modified by: pmx
 * @Last Modified time: 2022-06-22 14:23:36
 */
import { Injectable } from '@angular/core';
import { DigestResponse } from 'src/app/network/request/auth/digest-response.class';

@Injectable({
  providedIn: 'root',
})
export class SessionStorageService {
  set challenge(challenge: DigestResponse) {
    sessionStorage.setItem('smart_challenge', JSON.stringify(challenge));
  }
  get challenge() {
    let challenge_str = sessionStorage.getItem('smart_challenge');

    return challenge_str == null ? null : JSON.parse(challenge_str);
  }

  clear(name?: string) {
    if (name) {
      sessionStorage.removeItem(name);
    } else {
      sessionStorage.clear();
    }
  }
}
