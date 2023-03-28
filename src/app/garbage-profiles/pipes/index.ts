import { GarbageStationProfileStateColorPipe } from './garbage-station-profile-state-color.pipe';
import { MaintenanceConstructionStateStepPipe } from './maintenance-construction-state-step.pipe';
import { MaintenanceProfileStateStepPipe } from './maintenance-profile-state-step.pipe';

export const CUSTOM_PIPES = [
  GarbageStationProfileStateColorPipe,
  MaintenanceProfileStateStepPipe,
  MaintenanceConstructionStateStepPipe,
];
