import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { instanceToPlain, plainToInstance } from 'class-transformer';
import { Subscription } from 'rxjs';
import { RoutePath } from 'src/app/app-routing.path';
import { UserType } from 'src/app/enum/user-type.enum';
import { ISideNavConfig } from '../../models/sidenav-config';
import { LocalStorageService } from '../../service/local-storage.service';
import { ValidPathExp } from '../../tools/tool';

@Component({
  selector: 'howell-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.less'],
  animations: [
    trigger('growShrink', [
      state(
        'grow',
        style({
          width: '*',
        })
      ),
      state(
        'shrink',
        style({
          width: 110,
        })
      ),
      transition('grow<=>shrink', [animate(100)]),
    ]),
  ],
})
export class SidenavComponent implements OnInit, OnChanges, OnDestroy {
  state: 'grow' | 'shrink' = 'grow';
  groups = {
    first: '',
    second: '',
    third: '',
  };

  private _subscription: Subscription;

  models: Array<ISideNavConfig> = [];

  constructor(
    private _router: Router,
    private _activeRoute: ActivatedRoute,
    local: LocalStorageService
  ) {
    this._subscription = this._router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        // console.log('router', e);

        let mode = e.urlAfterRedirects.match(ValidPathExp);
        // console.log('mode: ', mode);
        if (mode && mode.groups && mode.groups['first']) {
          Object.assign(this.groups, mode.groups);
          import(`src/assets/json/${mode.groups['first']}.json`).then(
            (config) => {
              let plain = instanceToPlain(config);
              let instance = plainToInstance(MonitorPlatformConfig, plain);
              let user = local.user;
              instance.data.forEach((data) => {
                switch (user.UserType) {
                  case UserType.maintenance:
                  case UserType.maintenance_admin:
                    let index = data.children.findIndex(
                      (x) => x.id === RoutePath.station_profile_index
                    );
                    if (index >= 0) {
                      // data.children.splice(index, 1);
                      data.children[index].hideSelf = true;
                    }
                    break;

                  default:
                    break;
                }
              });
              config = instance;
              this.models = config.data;
            }
          );
        }
      }
    });
  }

  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {}
  ngOnDestroy(): void {
    this._subscription.unsubscribe();
  }
  toggle() {
    if (this.state == 'grow') {
      this.state = 'shrink';
    } else {
      this.state = 'grow';
    }
  }
  clickBtn(model: ISideNavConfig) {
    // console.log(model);
    if (!model.CanNavigate) {
      let mode = model.path.match(ValidPathExp);
      if (mode?.groups?.['second'] == this.groups.second) {
        console.log('同一父标签');
        return;
      }
    }

    this._router.navigateByUrl(model.path);
  }
}

class MonitorPlatformConfig {
  $schema: string = '';
  data: IMonitorPlatformDataConfig[] = [];
}
interface IMonitorPlatformDataConfig {
  title: string;
  id: string;
  icon: string;
  path: string;
  CanNavigate: boolean;
  children: any[];
}
