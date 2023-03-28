import { PropertyCategory } from 'src/app/enum/property-category.enum';

export interface GarbageProfileReactivePropertySearchInfo {
  Name?: string;
  Category?: PropertyCategory;
}

export enum FormStatusCode {
  None = 0,
  Failed = 400,
  Success = 200,
  NotModified = 304,
}
