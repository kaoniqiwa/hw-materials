import { Component, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { Subscription } from 'rxjs';
import { ValidPathExp } from 'src/app/common/tools/tool';
import { GarbageStationProfilesLanguageTools } from '../../tools/language.tool';
import { GarbageStationProfileIndexBusiness } from './garbage-station-profile-index.business';
import {
  GarbageStationProfileIndexManager,
  GarbageStationProfileIndexModel,
} from './garbage-station-profile-index.model';

@Component({
  selector: 'garbage-station-profile-index',
  templateUrl: './garbage-station-profile-index.component.html',
  styleUrls: ['./garbage-station-profile-index.component.less'],
  providers: [GarbageStationProfileIndexBusiness],
})
export class GarbageStationProfileIndexComponent implements OnInit {
  private _subscription: Subscription;
  show = true;
  constructor(
    public language: GarbageStationProfilesLanguageTools,
    private business: GarbageStationProfileIndexBusiness,
    private router: Router
  ) {
    this._subscription = this.router.events.subscribe((e) => {
      if (e instanceof Scroll) {
        let mode = e.routerEvent.urlAfterRedirects.match(ValidPathExp);
        // console.log(mode);
        if (mode && mode.groups && mode.groups['third'] == 'profile-index' &&
          !mode.groups['forth']) {
          // console.log('show');
          this.show = true;
        } else {
          // console.log('hide');
          this.show = false;
        }
      }
    });
  }
  model?: GarbageStationProfileIndexModel;
  manager?: GarbageStationProfileIndexManager;
  ngOnInit(): void {
    this.manager = undefined;
    this.business.load().then((x) => {
      this.model = x;
    });
  }

  onprofileclick(state: number) {
    this.manager = new GarbageStationProfileIndexManager();
    this.manager.state = state;
  }
  onlabelclick() {
    // this.router.navigateByUrl(RoutePath.label_manager);
  }
}
