import { MaterialCategory } from '../network/entity/material-category.entity';
import { Material } from '../network/entity/material.entity';

export class MaterialModel extends Material {
  CategoryInfo!: Promise<MaterialCategory>;
}
