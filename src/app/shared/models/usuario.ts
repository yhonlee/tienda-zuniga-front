export class Usuario {

    public id: number;
    public name: string;
    public lastname: string;
    public id_employee: string;
    public id_state: number;
    public id_rol: number;
    public access_token: string;


    constructor() {
        this.id = 0;
        this.name = '';
        this.lastname = '';
        this.id_rol = 0;
        this.id_employee = '';
        this.id_state = 0;
        this.access_token = '';
    }
}