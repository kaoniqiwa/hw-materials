import { Component, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { RoutePath } from 'src/app/app-routing.path';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { ValidPathExp } from 'src/app/common/tools/tool';
import { UserType } from 'src/app/enum/user-type.enum';
import { User } from 'src/app/network/entity/user.model';
import { GarbageStationProfilesLanguageTools } from '../../tools/garbage-station-profile-language.tool';
import { GarbageStationProfileIndexBusiness } from './garbage-station-profile-index.business';
import { GarbageStationProfileIndexModel } from './garbage-station-profile-index.model';

@Component({
  selector: 'garbage-station-profile-index',
  templateUrl: './garbage-station-profile-index.component.html',
  styleUrls: ['./garbage-station-profile-index.component.less'],
  providers: [GarbageStationProfileIndexBusiness],
})
export class GarbageStationProfileIndexComponent implements OnInit {
  constructor(
    public language: GarbageStationProfilesLanguageTools,
    private business: GarbageStationProfileIndexBusiness,
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
          mode.groups['third'] == RoutePath.station_profile_index &&
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
  model?: GarbageStationProfileIndexModel;
  private user: User;
  ngOnInit(): void {
    if (this.user.UserType === UserType.admin) {
      this.business.load().then((x) => {
        this.model = x;
      });
    } else if (this.user.UserType === UserType.maintenance_admin) {
      console.log(this.router);
      let url = this.router.url.replace(
        RoutePath.station_profile_index,
        RoutePath.maintenance_profile_index
      );
      this.router.navigateByUrl(url);
    }
  }
}
