/*
 * Copyright (C) 2015 Juergen Zimmermann, Hochschule Karlsruhe
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {Component, CORE_DIRECTIVES} from 'angular2/angular2';

import IamService from '../iam/iam_service';

@Component({
    selector: 'logout',
    template: `
        <div *ng-if="isLoggedIn()">
            <i class="fa fa-2x fa-sign-out"></i> &nbsp;
            <button class="btn btn-default" type="button">Logout</button>
        </div>
    `,
    directives: [CORE_DIRECTIVES]
})
export default class Logout {
    constructor(private _iamService: IamService) {
        console.log('Logout.constructor()');
    }

    isLoggedIn(): boolean { return this._iamService.isLoggedIn(); }

    logout(): void { console.log('Logout.logout()'); }

    toString(): String { return 'Logout'; }
}
