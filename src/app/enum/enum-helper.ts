import { DivisionLevel } from './division-level.enum';

export class EnumHelper {
  constructor() {}

  static getDivisionChildLevel(level: DivisionLevel) {
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
}
