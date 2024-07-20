import { MatPaginatorIntl } from '@angular/material/paginator';

const chileRangeLabel = (page: number, pageSize: number, length: number) => {
  if (length == 0 || pageSize == 0) { return `0 van ${length}`; }

  length = Math.max(length, 0);

  const startIndex = page * pageSize;

  const endIndex = startIndex < length ?
    Math.min(startIndex + pageSize, length) :
    startIndex + pageSize;

  return `Página ${startIndex + 1} - ${endIndex} de ${length}`;
}


export function getSpanishPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl();

  paginatorIntl.itemsPerPageLabel = 'Cantidad Por Página:';
  paginatorIntl.firstPageLabel = 'Primera página';
  paginatorIntl.nextPageLabel = 'Siguiente Página';
  paginatorIntl.previousPageLabel = 'Página Anterior';
  paginatorIntl.lastPageLabel = 'Ultima página';
  paginatorIntl.getRangeLabel = chileRangeLabel;

  return paginatorIntl;
}