import { Division } from 'src/app/network/entity/division.entity';

export interface ProfileDetailsDivisionSearchInfo {
  Name?: string;
  ParentId?: string;
  ParentIdIsNull?: boolean;
}

export class ProfileDetailsDivisionModel {
  Province: Division[] = [];
  City: Division[] = [];
  County: Division[] = [];
  Street: Division[] = [];
  Committee: Division[] = [];
}

export enum DivisionLevel {
  None = 'None',
  Province = 'Province',
  City = 'City',
  County = 'County',
  Street = 'Street',
  Committee = 'Committee',
}

export function getDivisionChildLevel(level: DivisionLevel) {
  switch (level) {
    case DivisionLevel.None:
      return DivisionLevel.Province;
    case DivisionLevel.Province:
      return DivisionLevel.City;
    case DivisionLevel.City:
      return DivisionLevel.County;
    case DivisionLevel.County:
      return DivisionLevel.Street;
    case DivisionLevel.Street:
      return DivisionLevel.Committee;
    default:
      return null;
  }
}
