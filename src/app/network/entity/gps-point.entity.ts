/**	GPS坐标	*/

import { IModel } from "src/app/common/interfaces/model.interface";

export class GPSPoint implements IModel {
  /**	Double	经度	M	*/
  Longitude!: number;
  /**	Double	纬度	M	*/
  Latitude!: number;
}
