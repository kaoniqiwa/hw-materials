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
import { Subscription } from 'rxjs';
import { ISideNavConfig } from '../../models/sidenav-config';
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

  constructor(private _router: Router, private _activeRoute: ActivatedRoute) {
    this._subscription = this._router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        // console.log('router', e);

        let mode = e.urlAfterRedirects.match(ValidPathExp);
        // console.log('mode: ', mode);
        if (mode && mode.groups && mode.groups['first']) {
          Object.assign(this.groups, mode.groups);
          import(`src/assets/json/${mode.groups['first']}.json`).then(
            (config) => {
              // console.log('config', config.data);

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
