import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 70): string {
    if (!value) return '';
    
    if (value.length <= limit) return value;
    return `${value.substring(0, limit)}...`;
  }
}
