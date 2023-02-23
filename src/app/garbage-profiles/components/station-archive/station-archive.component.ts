import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Scroll } from '@angular/router';
import { Subscription } from 'rxjs';
import {
  ISideNavConfig,
  SideNavConfig,
} from 'src/app/common/models/sidenav-config';
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

  constructor(private _router: Router) {
    this.config = Config.data.find((data) => {
      return data.id == this.id;
    });
    // console.log(this.config);

    this._subscription = this._router.events.subscribe((e) => {
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
    this._router.navigateByUrl(path);
  }
}
