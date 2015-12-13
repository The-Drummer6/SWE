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

import {Component} from 'angular2/angular2';

import Logo from './logo';
import Login from './login';
import Logout from './logout';

@Component({
    selector: 'app-header',
    template: `
        <div class="clearfix">
            <div class="pull-left">
                <logo></logo>
            </div>
            <div class="pull-right">
                <login></login>
                <logout></logout>
            </div>
        </div>
    `,
    directives: [Logo, Login, Logout]
})
export default class Header {
    constructor() { console.log('Header.constructor()'); }

    toString(): String { return 'Header'; }
}
