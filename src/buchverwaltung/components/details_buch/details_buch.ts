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

import {Component, CORE_DIRECTIVES, OnInit} from 'angular2/angular2';
import {ROUTER_DIRECTIVES, RouteParams, CanActivate} from 'angular2/router';
import {Response} from 'angular2/http';

import BuecherService from '../../service/buecher_service';
import Buch from '../../model/buch';
import Stammdaten from './stammdaten';
import Schlagwoerter from './schlagwoerter';
import {isAdmin} from '../../../iam/iam_service';
import {isPresent} from '../../../util/util';

@Component({
    selector: 'details-buch',
    template: `
        <section *ng-if="buch !== null">
            <h3>Buch {{buch.id}}:</h3>

            <ul class="nav nav-tabs">
                <li class="active">
                    <a href="#stammdaten" data-toggle="tab">Stammdaten</a>
                </li>
                <li *ng-if="buch.hasSchlagwoerter()">
                    <a href="#schlagwoerter" data-toggle="tab">Schlagwoerter</a>
                </li>
            </ul>

            <div class="tab-content">
                <div class="tab-pane fade in active" id="stammdaten">
                    <stammdaten [buch]="buch"></stammdaten>
                </div>
                <div class="tab-pane fade" id="schlagwoerter"
                     *ng-if="buch.hasSchlagwoerter()">
                    <schlagwoerter [values]="buch.schlagwoerter">
                    </schlagwoerter>
                </div>
            </div>

            <div>
                &nbsp;
                <a [router-link]="['UpdateBuch', {'id': buch.id}]"
                   data-toggle="tooltip" title="Bearbeiten">
                   <i class="fa fa-2x fa-edit"></i>
                </a>
            </div>
        </section>

        <div class="has-error" *ng-if="buch === null">
            <span class="help-block">
                <h4>Es gibt kein Buch zur angegebenen ID</h4>
            </span>
        </div>
    `,
    directives:
        [CORE_DIRECTIVES, Stammdaten, Schlagwoerter, ROUTER_DIRECTIVES]
})
// Die Komponente kann nur aktiviert bzw. benutzt werden, wenn die aufgerufene
// Function true liefert. CanActivate ist ein "Lifecycle Hook" des Routers.
@CanActivate(() => isAdmin())
export default class DetailsBuch implements OnInit {
    constructor(
        private _buecherService: BuecherService,
        private _routeParams: RouteParams) {
        console.log('DetailsBuch.constructor(): routeParams=', _routeParams);
    }

    // Methode zum "LifeCycle Hook" OnInit: wird direkt nach dem Konstruktor
    // aufgerufen:
    // jspm_packages\npm\angular2...\ts\src\core\linker\interfaces.ts
    // Die Methode onInit wird umbenannt in ngOnInit
    // https://github.com/angular/angular/issues/5036
    onInit(): void {
        // Pfad-Parameter aus /detailsBuch/:id
        const id: string = this._routeParams.params['id'];
        console.log('DetailsBuch.onInit(): id=', id);

        const errorHTTP: (response: Response) => void =
            (response: Response) => {
                if (isPresent(id)) {
                    console.error(`Kein Buch zur ID ${id} gefunden`);
                }
            };
        this._buecherService.findById(id, errorHTTP);
    }

    get buch(): Buch { return this._buecherService.buch; }

    toString(): String { return 'DetailsBuch'; }
}
