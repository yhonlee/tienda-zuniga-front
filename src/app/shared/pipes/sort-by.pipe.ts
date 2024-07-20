import { Pipe, PipeTransform, NgModule } from '@angular/core';
import { orderBy } from 'lodash';

@Pipe({ name: 'sortBy' })

export class SortByPipe implements PipeTransform {

  transform<T>(value: T[], order: 'asc' | 'desc' = 'asc', column: keyof T,): T[] {

    if (!value) return value;

    if (value.length <= 1) return value;

    if (!column || column === '') {

      if (order === 'asc') return value.sort();

      return value.sort().reverse();

    }

    return orderBy(value, [column], [order]);
    
  }

}

@NgModule({
  declarations: [SortByPipe],
  exports: [SortByPipe]
})

export class SortByPipeModule { }
