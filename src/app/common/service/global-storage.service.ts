import { EventEmitter, Injectable } from '@angular/core';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalStorageService {
  constructor(private localStorage: LocalStorageService) {}
}
