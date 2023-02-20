import { IBusiness } from './bussiness.interface';
import { IModel } from './model.interface';

export interface IComponent<TModel extends IModel, TViewModel> {
  business: IBusiness<TModel, TViewModel>;
}
