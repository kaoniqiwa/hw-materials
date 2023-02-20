import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'common-time',
  templateUrl: './common-time.component.html',
  styleUrls: ['./common-time.component.less'],
})
export class CommonTimeComponent implements OnInit, OnDestroy {
  today: number = Date.now();

  private _subscription: Subscription | null = null;

  constructor() {}

  ngOnInit(): void {
    this._subscription = interval(1000).subscribe((n) => {
      this.today = Date.now();
    });
  }

  ngOnDestroy() {
    if (this._subscription) {
      this._subscription.unsubscribe();
      this._subscription = null;
    }
  }
}
