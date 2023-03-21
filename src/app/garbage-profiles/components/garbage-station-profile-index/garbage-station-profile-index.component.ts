import { Component, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { ValidPathExp } from 'src/app/common/tools/tool';
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
    private router: Router
  ) {
    this.router.events.subscribe((e) => {
      if (e instanceof Scroll) {
        let mode = e.routerEvent.urlAfterRedirects.match(ValidPathExp);
        // console.log(mode);
        if (
          mode &&
          mode.groups &&
          mode.groups['third'] == 'profile-index' &&
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
  ngOnInit(): void {
    this.business.load().then((x) => {
      this.model = x;
    });
  }

  onlabelclick() {
    // this.router.navigateByUrl(RoutePath.label_manager);
  }
}
