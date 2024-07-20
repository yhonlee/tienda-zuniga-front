import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { jwtDecode } from "jwt-decode";
import { Usuario } from "../models/usuario";
import { constanst } from "../constants/global.constant";

@Injectable({
    providedIn: 'root'
})
export class TokenService {

    constructor(private route: Router) { }

    get getToken(): string {

        const storage: string = this.getSession();

        if (!Boolean(storage)) return storage;

        const { access_token }: Usuario = JSON.parse(storage);
        return access_token;

    }

    get isAuthenticated(): boolean {
        return Boolean(this.getToken);
    }

    get getIdUser(): string {

        const storage: string = this.getSession();

        if (!Boolean(storage)) return storage;

        const { id }: Usuario = JSON.parse(storage);
        return id.toString();

    }

    get getUser(): Usuario | null {

        const storage: string = this.getSession();

        if (!Boolean(storage)) return null;

        const User: Usuario = JSON.parse(storage);
        return User;

    }

    private getSession(): string {
        return localStorage.getItem(constanst.SESSION_STORAGE) || '';
    }

    private onRemoveTokens(): void {
        localStorage.clear();
        this.route.navigateByUrl('/login');
    }

    public onSignOut(): void {
        this.onRemoveTokens();
    }

    public decode<T>(token: string): T | null {
        try {
            return jwtDecode<T>(token);
        } catch (Error) {
            return null;
        }
    }
}