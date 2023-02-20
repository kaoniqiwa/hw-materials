/*
 * @Author: pmx
 * @Date: 2022-12-06 13:53:06
 * @Last Modified by:   pmx
 * @Last Modified time: 2022-12-06 13:53:06
 */

import { CommonChartModel } from "src/app/model/common-chart.model";

export interface ICommonCharBusiness<T = any> {
  init(...args: any): Promise<CommonChartModel<T>> | CommonChartModel<T>;
}
