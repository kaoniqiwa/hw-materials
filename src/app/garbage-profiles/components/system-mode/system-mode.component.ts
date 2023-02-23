import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SystemModeConfig } from 'src/app/common/models/system-mode.config';
import Config from 'src/assets/json/system-mode.json';

@Component({
  selector: 'system-mode',
  templateUrl: './system-mode.component.html',
  styleUrls: ['./system-mode.component.less'],
})
export class SystemModeComponent implements OnInit {
  config = Config.data as SystemModeConfig[];
  constructor(private _title: Title, private _router: Router) {
    this._title.setTitle('生活垃圾档案管理系统');
  }

  ngOnInit(): void {}

  navigate(path: string) {
    this._router.navigateByUrl(path);
  }
}
