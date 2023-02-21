import { formatDate } from '@angular/common';
import { TransformationType, TransformFnParams } from 'class-transformer';

export function transformDateTime(params: TransformFnParams) {
  if (params.value === undefined || params.value === null) return undefined;
  if (params.type === TransformationType.PLAIN_TO_CLASS) {
    return new Date(params.value);
  } else if (params.type === TransformationType.CLASS_TO_PLAIN) {
    return (params.value as Date).toISOString();
  } else if (params.type === TransformationType.CLASS_TO_CLASS) {
    return new Date(params.value);
  } else {
    return '';
  }
}
export function transformDate(params: TransformFnParams) {
  if (params.type === TransformationType.PLAIN_TO_CLASS) {
    return new Date(params.value);
  } else if (params.type === TransformationType.CLASS_TO_PLAIN) {
    return formatDate(params.value as Date, 'yyyy-MM-dd', 'en');
  } else if (params.type === TransformationType.CLASS_TO_CLASS) {
    return new Date(params.value);
  } else {
    return '';
  }
}
export function transformTime(params: TransformFnParams) {
  if (params.type === TransformationType.PLAIN_TO_CLASS) {
    return new Date(params.value);
  } else if (params.type === TransformationType.CLASS_TO_PLAIN) {
    return formatDate(params.value as Date, 'HH:mm:ss', 'en');
  } else if (params.type === TransformationType.CLASS_TO_CLASS) {
    return new Date(params.value);
  } else {
    return '';
  }
}

export function transformParams(params: TransformFnParams) {
  if (params.type === TransformationType.CLASS_TO_PLAIN) {
    switch (params.value) {
      case 'unknown':
      case 'undefined':
        return undefined;
      case 'yes':
        return true;
      case 'no':
        return false;
      default:
        return params.value;
    }
  } else if (params.type === TransformationType.PLAIN_TO_CLASS) {
    switch (params.value) {
    }
  } else {
    return params.value;
  }
}
export function transformKeyValue(params: TransformFnParams) {
  if (params.type === TransformationType.PLAIN_TO_CLASS) {
    switch (params.value) {
      case 'unknown':
        return undefined;
      case 'yes':
        return true;
      case 'no':
        return false;
      default:
        return params.value;
    }
  }
  return params.value;
}
export function transformRecordName(params: TransformFnParams) {
  if (params.type === TransformationType.PLAIN_TO_CLASS) {
    switch (params.value) {
      case undefined:
      case 'unknown':
      case '':
        return '未知';
      default:
        return params.value;
    }
  }
  return params.value;
}
export function transformImageData(params: TransformFnParams) {
  if (params.type === TransformationType.CLASS_TO_PLAIN) {
    if (params.value) {
      let str = params.value as string;
      let index = str.indexOf('base64,') + 7;
      return str.substring(index);
    }
  }
  return params.value;
}

export function transformNumber(params: TransformFnParams) {
  if (params.type === TransformationType.CLASS_TO_PLAIN) {
    if (params.value === 0) {
      return undefined;
    }
  }
  return params.value;
}
