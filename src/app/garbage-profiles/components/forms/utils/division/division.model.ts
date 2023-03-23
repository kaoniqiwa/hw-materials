import { Division } from 'src/app/network/entity/division.entity';

export class DivisionInfo {
  Province: Division[] = [];
  City: Division[] = [];
  County: Division[] = [];
  Street: Division[] = [];
  Committee: Division[] = [];
}
export interface DivisionSearchInfo {
  Name?: string;
  ParentId?: string;
  ParentIdIsNull?: boolean;
}

export const NULL_KEY = 'null';
