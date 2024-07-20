import { PageEvent } from "@angular/material/paginator";

interface IPaginatorConfig {
  actual_page?: number;
  total_pages?: number;
  elements_per_page?: number;
  total_rows?: number;
  pageSizeOptions?: number[];
}

export interface IPaginador extends Omit<IPaginatorConfig, 'totalElements' | "pageSizeOptions"> {
  total: number;
}

export class Paginator {

  pages!: number;
  per_page!: number;
  totalElements!: number;
  actual_page!: number;
  pageSizeOptions!: number[];

  constructor(config: IPaginatorConfig = {}) {
    Object.assign(this, config);
  }

  public onSetUpPaginador(pagination: IPaginador): this {
    const { actual_page = this.actual_page, elements_per_page = this.per_page, total_rows = this.totalElements, total_pages = this.pages } = pagination ?? {};
    Object.assign(this, { actual_page: actual_page - 1, per_page: elements_per_page, totalElements: total_rows, pages: total_pages });
    return this;
  }

  public onChangePage(event: PageEvent): this {
    this.pages = event.pageIndex + 1;
    this.per_page = event.pageSize;
    return this;
  }

  public onHideDisplayedPaginator(paginador: Paginator): boolean {
    return (paginador && paginador.totalElements !== 0 && paginador.pages > 1);
  }

}