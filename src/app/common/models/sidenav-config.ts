export interface ISideNavConfig {
  title: string;
  id: string;
  path: string;
  icon?: string;
  children?: Array<ISideNavConfig>;
  CanNavigate?: boolean;
  hideChildren?: boolean;
  hideSelf?: boolean;
}

export class SideNavConfig {
  title!: string;
  id!: string;
  path!: string;
  icon?: string;
  children?: Array<SideNavConfig>;
  CanNavigate?: boolean;
  hideChildren?: boolean;
  hideSelf?: boolean;
}
