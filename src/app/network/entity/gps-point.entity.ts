import { IModel } from 'src/app/interface/model.interface';

/**	GPS坐标	*/

export class GPSPoint implements IModel {
  /**	Double	经度	M	*/
  Longitude!: number;
  /**	Double	纬度	M	*/
  Latitude!: number;
}
