import { Component, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { RoutePath } from 'src/app/app-routing.path';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { ValidPathExp } from 'src/app/common/tools/tool';
import { UserType } from 'src/app/enum/user-type.enum';
import { User } from 'src/app/network/entity/user.model';
import { MaintenanceProfilesLanguageTools } from '../../tools/maintenance-profile-language.too';
import { MaintenanceProfileIndexBusiness } from './maintenance-profile-index.business';
import {
  ConstructionStateStatisticItem,
  MaintenanceProfileIndexModel,
} from './maintenance-profile-index.model';

@Component({
  selector: 'maintenance-profile-index',
  templateUrl: './maintenance-profile-index.component.html',
  styleUrls: ['./maintenance-profile-index.component.less'],
  providers: [MaintenanceProfileIndexBusiness],
})
export class MaintenanceProfileIndexComponent implements OnInit {
  constructor(
    public language: MaintenanceProfilesLanguageTools,
    private business: MaintenanceProfileIndexBusiness,
    private router: Router,
    local: LocalStorageService
  ) {
    this.user = local.user;
    this.router.events.subscribe((e) => {
      if (e instanceof Scroll) {
        let mode = e.routerEvent.urlAfterRedirects.match(ValidPathExp);
        // console.log(mode);
        if (
          mode &&
          mode.groups &&
          mode.groups['third'] == RoutePath.maintenance_profile_index &&
          !mode.groups['forth']
        ) {
          // console.log('show');
          this.show = true;
        } else {
          // console.log('hide');
          this.show = false;
        }
      }
    });
  }
  show = true;
  model?: MaintenanceProfileIndexModel;

  constructionItems: ConstructionStateStatisticItem[] = [];
  constructionTotal = 0;

  private user: User;
  ngOnInit(): void {
    if (this.user.UserType !== UserType.maintenance) {
      this.business.load().then((x) => {
        this.model = x;
      });

      // this.business.getConstructionData().then((x) => {
      //   this.constructionItems = x.Items;

      //   console.log('全部状态', this.constructionTotal);
      // });
      this.business.getConstructionData().then((res) => {
        console.log(res);
        this.constructionItems = res;

        this.constructionTotal = res.reduce((prev, cur) => {
          return prev + cur.Number;
        }, 0);
        // console.log('全部状态', this.constructionTotal);
      });
    } else {
      if (this.router.url.indexOf(RoutePath.profile_manager) < 0) {
        let url = `${this.router.url}/${RoutePath.profile_manager}`;
        this.router.navigateByUrl(url);
      }
    }
  }

  getState() {
    switch (this.user.UserType) {
      case UserType.maintenance_admin:
        return [1];

      default:
        return undefined;
    }
  }
}
