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
// RouterLink: Directive fuer die Verwendung von Links in
// <a [router-link]="['/...']"/>
import {ROUTER_DIRECTIVES} from 'angular2/router';

import IamService from '../iam/iam_service';

@Component({
    selector: 'app-nav',
    template: `
        <ul class="nav nav-pills nav-stacked">
            <li><a [router-link]="['Home']">
                <i class="fa fa-home"></i> &nbsp; Startseite</a>
            </li>
            <li><a [router-link]="['SucheBuecher']">
                <i class="fa fa-search"></i> &nbsp; Suche</a>
            </li>
            <li *ng-if="isAdmin()"><a [router-link]="['CreateBuch']">
                <i class="fa fa-book"></i> &nbsp; Neues Buch</a>
            </li>
            <li *ng-if="isAdmin()"><a [router-link]="['CreateArtikel']">
                <i class="fa fa-book"></i> &nbsp; Neuer Artikel</a>
            </li>
            <li *ng-if="isAdmin()"><a [router-link]="['Balkendiagramm']">
                <i class="fa fa-bar-chart"></i> &nbsp; Balkendiagramm</a>
            </li>
            <li *ng-if="isAdmin()"><a [router-link]="['Liniendiagramm']">
                <i class="fa fa-line-chart"></i> &nbsp; Liniendiagramm</a>
            </li>
            <li *ng-if="isAdmin()"><a [router-link]="['Tortendiagramm']">
                <i class="fa fa-pie-chart"></i> &nbsp; Tortendiagramm</a>
            </li>
            <!--
                DSL-Pfade durch @RouteConfig([{path: '/...', name: 'Home' ...}
                <a [router-link]="['Home']">
            -->
        </ul>
    `,
    directives: [ROUTER_DIRECTIVES, CORE_DIRECTIVES]
    // viewProviders: [IamService]
})
export default class Nav {
    constructor(private _iamService: IamService) {
        console.log('Nav.constructor()');
    }

    isAdmin(): boolean { return this._iamService.isAdmin(); }

    toString(): String { return 'Nav'; }
}
