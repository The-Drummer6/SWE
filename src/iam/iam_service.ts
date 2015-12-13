import {Injectable, Injector} from 'angular2/angular2';

@Injectable()
export default class IamService {
    private _loginname: string;
    private _password: string;

    constructor() { console.log('IamService.constructor()'); }

    isLoggedIn(): boolean { return true; }

    isAdmin(): boolean { return true; }

    toString(): String {
        return `IamService: {loginname: ${this._loginname}, password=${this._password}}`;
    }
}

// fuer den Aufruf innerhalb von @CanActivate
export function isAdmin(): boolean {
    'use strict';
    return Injector.resolveAndCreate([IamService])  // Injector
        .get(IamService)                            // Objekt von IamService
        .isAdmin();
}
