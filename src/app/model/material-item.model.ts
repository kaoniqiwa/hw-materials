import { Exclude } from 'class-transformer';
import { MaterialItem } from '../network/entity/material-item.enitty';
import { MaterialModel } from './material.model';

export class MaterialItemModel extends MaterialItem {
  @Exclude()
  Model!: Promise<MaterialModel>;
}
