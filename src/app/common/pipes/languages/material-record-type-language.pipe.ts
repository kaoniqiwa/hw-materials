import { Pipe, PipeTransform } from '@angular/core';
import { MaterialRecordType } from 'src/app/enum/material-record-type.enum';

@Pipe({
  name: 'material_record_type_language',
})
export class MaterialRecordTypeLanguagePipe implements PipeTransform {
  transform(type?: MaterialRecordType) {
    switch (type) {
      case MaterialRecordType.putin:
        return '入库';
      case MaterialRecordType.putout:
        return '出库';
      default:
        return '';
    }
  }
}
