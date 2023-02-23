export interface ISystemModeConfig {
  title: string;
  id: string;
  path: string;
  icon?: string;
  children?: Array<ISystemModeConfig>;
  CanNavigate?: boolean;
  hideChildren?: boolean;
}

export class SystemModeConfig {
  title!: string;
  id!: string;
  path!: string;
  icon?: string;
  children?: Array<SystemModeConfig>;
  CanNavigate?: boolean;
  hideChildren?: boolean;
}
