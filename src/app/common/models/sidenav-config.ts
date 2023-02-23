export interface ISideNavConfig {
  title: string;
  id: string;
  path: string;
  icon?: string;
  children?: Array<ISideNavConfig>;
  CanNavigate?: boolean;
  hideChildren?: boolean;
}

export class SideNavConfig {
  title!: string;
  id!: string;
  path!: string;
  icon?: string;
  children?: Array<ISideNavConfig>;
  CanNavigate?: boolean;
  hideChildren?: boolean;
}
