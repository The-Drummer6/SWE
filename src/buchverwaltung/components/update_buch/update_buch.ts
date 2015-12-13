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
import {RouteParams, CanActivate} from 'angular2/router';
import {Response} from 'angular2/http';

import BuecherService from '../../service/buecher_service';
import Buch from '../../model/buch';
import Stammdaten from './stammdaten';
import Schlagwoerter from './schlagwoerter';
import {isAdmin} from '../../../iam/iam_service';
import {isPresent} from '../../../util/util';

@Component({
    selector: 'update-buch',
    template: `
        <section *ng-if="buch !== null">
            <h3>Buch {{buch.id}}:</h3>

            <ul class="nav nav-tabs">
                <li class="active">
                    <a href="#stammdaten" data-toggle="tab">Stammdaten</a>
                </li>
                <li *ng-if="buch.schlagwoerter.length !== 0">
                    <a href="#schlagwoerter" data-toggle="tab">Schlagw&ouml;rter</a>
                </li>
            </ul>

            <div class="tab-content">
                <div class="tab-pane fade in active" id="stammdaten">
                    <stammdaten [buch]="buch"></stammdaten>
                </div>
                <div class="tab-pane fade" id="schlagwoerter">
                    <schlagwoerter [buch]="buch"></schlagwoerter>
                </div>
            </div>
        </section>

        <div class="has-error" *ng-if="buch === null">
            <span class="help-block"><h4>Es gibt kein Buch zur angegebenen ID</h4></span>
        </div>
    `,
    directives: [CORE_DIRECTIVES, Stammdaten, Schlagwoerter]
})
// Die Komponente kann nur aktiviert bzw. benutzt werden, wenn die aufgerufene
// Function true liefert
@CanActivate(() => isAdmin())
export default class UpdateBuch implements OnInit {
    constructor(
        private _buecherService: BuecherService,
        private _routeParams: RouteParams) {
        console.log('UpdateBuch.constructor(): routeParams=', _routeParams);
    }

    // Methode zum "LifeCycle Hook" OnInit: wird direkt nach dem Konstruktor
    // aufgerufen
    onInit(): void {
        // Pfad-Parameter aus /updateBuch/:id
        const id: string = this._routeParams.params['id'];
        console.log('UpdateBuch.onInit(): id=', id);

        const errorHTTP: (response: Response) => void =
            (response: Response) => {
                if (isPresent(id)) {
                    console.error(`Kein Buch zur ID ${id} vorhanden`);
                }
            };
        this._buecherService.findById(id, errorHTTP);
    }

    get buch(): Buch { return this._buecherService.buch; }

    toString(): String { return 'UpdateBuch'; }
}
