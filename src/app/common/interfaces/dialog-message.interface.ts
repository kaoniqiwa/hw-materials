import { DialogEnum } from "src/app/enum/dialog.enum";

export interface IDialogMessage<T> {
  type: DialogEnum;
  data: T;
}