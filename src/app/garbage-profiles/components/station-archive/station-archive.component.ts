import { Component, OnDestroy } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { Subscription } from 'rxjs';
import { ISideNavConfig } from 'src/app/common/models/sidenav-config';
import { LocalStorageService } from 'src/app/common/service/local-storage.service';
import { ValidPathExp } from 'src/app/common/tools/tool';
import Config from 'src/assets/json/monitor-platform.json';

@Component({
  selector: 'station-archive',
  templateUrl: './station-archive.component.html',
  styleUrls: ['./station-archive.component.less'],
})
export class StationArchiveComponent implements OnDestroy {
  private _subscription: Subscription;
  private id = 'station-archive';

  show = true;
  config?: ISideNavConfig;

  constructor(private router: Router, local: LocalStorageService) {
    // let plain = instanceToPlain(Config);
    // let instance = plainToInstance(MonitorPlatformConfig, plain);
    this.config = Config.data.find((data) => {
      // let user = local.user;
      // switch (user.UserType) {
      //   case UserType.maintenance_admin:
      //     let index = data.children.findIndex(
      //       (x) => x.id === RoutePath.station_profile_index
      //     );
      //     if (index >= 0) {
      //       data.children.splice(index, 1);
      //     }
      //     break;

      //   default:
      //     break;
      // }

      return data.id == this.id;
    });
    console.log(this.config);

    this._subscription = this.router.events.subscribe((e) => {
      if (e instanceof Scroll) {
        let mode = e.routerEvent.urlAfterRedirects.match(ValidPathExp);
        // console.log(mode);
        if (
          mode &&
          mode.groups &&
          mode.groups['second'] == 'station-archive' &&
          !mode.groups['third']
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
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
  navigate(path: string) {
    console.log(path);
    this.router.navigateByUrl(path);
  }
}
