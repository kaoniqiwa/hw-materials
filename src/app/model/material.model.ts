import { Exclude } from 'class-transformer';
import { MaterialCategory } from '../network/entity/material-category.entity';
import { Material } from '../network/entity/material.entity';

export class MaterialModel extends Material {
  @Exclude()
  CategoryInfo!: Promise<MaterialCategory>;
}
