import { EChartsOption } from 'echarts';

export class CommonChartModel<T = any> {
  /* 数量详情 */
  Merge: EChartsOption = {};

  RawData?: T;
}
