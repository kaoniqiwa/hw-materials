export class SidenavModel {
  title: string = '';
  id: string = '';
  path: string = '';
  icon?: string;
  children?: Array<SidenavModel> = [];
}
