import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.less'],
})
export class AccountInfoComponent implements OnInit {
  desc: string = '生活垃圾分类全程监管平台';
  title: string = '';

  constructor(private _localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    let user = this._localStorageService.user;
  }
}
