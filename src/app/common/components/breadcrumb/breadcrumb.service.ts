import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Breadcrumb } from './breadcrumb.model';
import qs from "qs";


@Injectable({
  providedIn: 'root',
})
export class BreadcrumbService {
  breadcrumbs$ = new BehaviorSubject<Breadcrumb[]>([]);

  constructor(private _router: Router) {
    this._router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe((e) => {
        const routeSnapshot = this._router.routerState.snapshot.root;
        const breadcrumbs: Breadcrumb[] = [];

        this._addBreadCrumb(routeSnapshot, [], breadcrumbs);

        if (breadcrumbs.length) {
          let last = breadcrumbs.at(breadcrumbs.length - 1)!;

          if (routeSnapshot.queryParams) {
            last.url += "?" + qs.stringify(routeSnapshot.queryParams)
          }
          if (routeSnapshot.fragment) {
            last.url += '#' + routeSnapshot.fragment
          }
        }


        this.breadcrumbs$.next(breadcrumbs);
      });
  }

  private _addBreadCrumb(
    activatedRouteSnapshot: ActivatedRouteSnapshot,
    parentUrl: string[],
    breadcrumbs: Breadcrumb[]
  ) {
    if (activatedRouteSnapshot) {
      const currrentUrl = parentUrl.concat(
        activatedRouteSnapshot.url.map((url) => url.path)
      );
      if (activatedRouteSnapshot.data['breadcrumb']) {
        let breadcrumb: Breadcrumb = {
          label: activatedRouteSnapshot.data['breadcrumb'],
          url: '/' + currrentUrl.join('/'),
        };
        breadcrumbs.push(breadcrumb);
      }

      if (activatedRouteSnapshot.firstChild) {
        this._addBreadCrumb(
          activatedRouteSnapshot.firstChild,
          currrentUrl,
          breadcrumbs
        );
      }


    }
  }
}
