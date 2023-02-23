import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.less'],
})
export class AccountInfoComponent implements OnInit {
  desc: string = '';
  title: string = '生活垃圾档案管理系统';

  constructor(title: Title) {
    title.setTitle(this.title);
  }

  ngOnInit(): void {}
}
