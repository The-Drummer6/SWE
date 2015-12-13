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
import Buch from '../../model/buch';

@Component({
    selector: 'stammdaten',
    // siehe @Input in der Komponenten-Klasse
    // inputs: ['buch'],
    template: `
        <table class="table table-stripped table-hover table-responsive">
            <tbody>
                <tr>
                    <td><label>Titel</label></td>
                    <td>{{buch.titel}}</td>
                </tr>
                <tr>
                    <td><label>Bewertung</label></td>
                    <td>
                        <span *ng-for="#r of buch.ratingArray">
                            <i class="fa fa-star" style="color: yellow;"
                               *ng-if="r === true"></i>
                        </span>
                    </td>
                </tr>
                <tr>
                    <td><label>Art</label></td>
                    <td>
                        <span [ng-switch]="buch.art">
                            <span *ng-switch-when="'GEBUNDEN'">gebunden</span>
                            <span *ng-switch-when="'BROSCHIERT'">broschiert</span>
                            <span *ng-switch-default>unbekannt</span>
                        </span>
                    </td>
                </tr>
                <tr>
                    <td><label>Verlag</label></td>
                    <td>
                        <span [ng-switch]="buch.verlag">
                            <span *ng-switch-when="'OREILLY'">O'Reilly</span>
                            <span *ng-switch-when="'PACKT'">Packt</span>
                            <span *ng-switch-default>unbekannt</span>
                        </span>
                    </td>
                </tr>
                <tr>
                    <td><label>Preis</label></td>
                    <!-- TODO 2 Nachkommastellen. Pipe "| number: '.2'" -->
                    <td>{{buch.preis | currency: 'EUR': true}}</td>
                </tr>
                <tr>
                    <td><label>Rabatt</label></td>
                    <!-- {minIntegerDigits}.{minFractionDigits}-{maxFractionDigits} -->
                    <!-- default: 1.0-3 -->
                    <!-- jspm_packages/npm/angular2@.../ts/src/.../number_pipe.ts -->
                    <td>{{buch.rabatt | percent: '.2'}}</td>
                </tr>
                <tr>
                    <td><label>Datum</label></td>
                    <td>
                        {{buch.datumFormatted}}<br/>
                        {{buch.datumFromNow}}
                    </td>
                </tr>
            </tbody>
        </table>
    `,
    directives: [CORE_DIRECTIVES]
})
export default class Stammdaten implements OnInit {
    // Property Binding: <stammdaten [buch]="...">
    // siehe InputMetadata in
    // jspm_packages\npm\angular2...\ts\src\core\metadata\directives.ts
    @Input() buch: Buch;

    constructor() { console.log('Stammdaten.constructor()'); }

    onInit(): void { console.log('Stammdaten.onInit(): buch=', this.buch); }

    toString(): String { return 'Stammdaten'; }
}
