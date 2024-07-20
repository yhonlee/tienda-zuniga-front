export class Pagination {

    public actual_page: number;
    public pages: number;
    public per_page: number;
    public total: number;

    constructor() {
        this.actual_page = 0;
        this.pages = 0;
        this.per_page = 0;
        this.total = 0;
    }

}