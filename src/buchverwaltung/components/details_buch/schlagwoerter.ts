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

import {Component, CORE_DIRECTIVES, Input, OnInit} from 'angular2/angular2';

@Component({
    selector: 'schlagwoerter',
    template: `
        <ul>
            <li *ng-for="#schlagwort of schlagwoerter">
                <span [ng-switch]="schlagwort">
                    <span *ng-switch-when="'SCHNULZE'">Schnulze</span>
                    <span *ng-switch-when="'SCIENCE_FICTION'">Science Fiction<br></span>
                </span>
            </li>
        </ul>
    `,
    directives: [CORE_DIRECTIVES]
})
export default class Schlagwoerter implements OnInit {
    // <schlagwoerter [values]="buch.schlagwoerter">
    // siehe InputMetadata in
    // jspm_packages\npm\angular2...\ts\src\core\metadata\directives.ts
    @Input('values') schlagwoerter: Array<string>;

    constructor() { console.log('Schlagwoerter.constructor()'); }

    onInit(): void {
        console.log(
            'Schlagwoerter.onInit(): schlagwoerter=', this.schlagwoerter);
    }

    toString(): String { return 'Schlagwoerter'; }
}
