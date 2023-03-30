import { GarbageStationProfileStateColorPipe } from './garbage-station-profile-state-color.pipe';
import { MaintenanceConstructionStateColorPipe } from './maintenance-construction-state-color.pipe';
import { MaintenanceConstructionStateStepPipe } from './maintenance-construction-state-step.pipe';
import { MaintenanceProfileStateColorPipe } from './maintenance-profile-state-color.pipe';
import { MaintenanceProfileStateStepPipe } from './maintenance-profile-state-step.pipe';

export const CUSTOM_PIPES = [
  GarbageStationProfileStateColorPipe,
  MaintenanceProfileStateStepPipe,
  MaintenanceConstructionStateStepPipe,
  MaintenanceConstructionStateColorPipe,
  MaintenanceProfileStateColorPipe,
];
