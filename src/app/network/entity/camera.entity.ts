import { IModel } from 'src/app/interface/model.interface';

/**	摄像机	*/
export class Camera implements IModel {
  /**	String	摄像机名称	M	*/ Name!: string;

  /**	Int32	摄像机型号	M	*/ Model!: number;
  /**	String	序列号：K83764140	M	*/ SerialNo!: string;
  /**	Int32	机位	M	*/ Placement!: number;
  /**	Int32	接入服务器	M	*/ AccessServer!: number;
  /**	Int32	分辨率	O	*/ Resolution?: number;
  /**	Int32	码率(Kbps)	O	*/ Bitrate?: number;
  /**	Int32	录像存储布防时间	O	*/ StorageTime?: number;
  /**	Int32	联动设备	O	*/ ActionEquipment?: number;
  /**	Int32	音频输出状态	O	*/ AudioOutputState?: number;
  /**	Int32	音量[0-100]，音频	O	*/ AudioVolume?: number;
  /**	Int32	AI模型类型	O	*/ AIModelType?: number;
}
