import { MaterialItem } from '../network/entity/material-item.enitty';
import { MaterialModel } from './material.model';

export class MaterialItemModel extends MaterialItem {
  Model!: Promise<MaterialModel>;
}
