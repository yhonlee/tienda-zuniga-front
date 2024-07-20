export interface AuthUser {
    username: string;
    password: string;
}

export interface ResponseAuth{
    data:    Data;
    message: string[];
    error:   string;
    status:  number;
}

export interface Data {
    user: User;
}

export interface User {
    id:           string;
    username:     string;
    id_rol:       number;
    id_employee:  string;
    id_state:     number;
    name:         string;
    lastname:     string;
    access_token: string;
}
