import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SidenavModel } from './sidenav.model';

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

  private _subscription!: Subscription;

  models: Array<SidenavModel> = [];

  constructor(private _router: Router) {
    this._subscription = this._router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        // console.log('router', e);
        // /(?<=\/garbage-profiles\/profile-index\/)(?<first>[\w-]*)(\/(?<second>[\w-]*))?(?=\/?)$/;
        let reg =
          /(?<=\/[\w-]+\/[\w-]+\/)(?<first>[\w-]*)(?:\/(?<second>[\w-]*)(?:\/(?<third>[\w-]*))?)?\/?$/;

        let mode = e.urlAfterRedirects.match(reg);
        console.log('mode: ', mode);
        if (mode && mode.groups) {
          Object.assign(this.groups, mode.groups);
          import(`src/assets/json/${mode.groups['first']}.json`).then(
            (config) => {
              console.log('config', config.data);

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
  navigate(e: Event) {
    let target = e.target as HTMLElement;

    // this._router.navigateByUrl(target.dataset.link!);
  }
  clickHandler() {}
}
