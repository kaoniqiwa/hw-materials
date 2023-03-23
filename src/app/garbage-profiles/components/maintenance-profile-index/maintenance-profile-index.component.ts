import { Component, OnInit } from '@angular/core';
import { Router, Scroll } from '@angular/router';
import { RoutePath } from 'src/app/app-routing.path';
import { ValidPathExp } from 'src/app/common/tools/tool';
import { MaintenanceProfilesLanguageTools } from '../../tools/maintenance-profile-language.too';
import { MaintenanceProfileIndexBusiness } from './maintenance-profile-index.business';
import { MaintenanceProfileIndexModel } from './maintenance-profile-index.model';

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
    private router: Router
  ) {
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
  ngOnInit(): void {
    this.business.load().then((x) => {
      this.model = x;
    });
  }
}
