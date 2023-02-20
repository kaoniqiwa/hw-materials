import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { GlobalStorageService } from 'src/app/common/service/global-storage.service';

export interface ISubscription {
  subscription?: Subscription;
  subscribe(fn: () => void): void;
  destroy(): void;
}

@Injectable({
  providedIn: 'root',
})
export class SubscriptionService implements ISubscription {
  constructor(private storeService: GlobalStorageService) {}
  subscription?: Subscription;

  subscribe(fn: () => void) {
    this.subscription = this.storeService.statusChange.subscribe(() => {
      fn();
    });
  }
  destroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
      this.subscription = undefined;
    }
  }
}
