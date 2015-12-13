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

import {Component, OnInit} from 'angular2/angular2';
import {CanActivate} from 'angular2/router';

import BuecherService from '../../service/buecher_service';
import {isAdmin} from '../../../iam/iam_service';

@Component({
    selector: 'torten-diagramm-bewertungen',
    template: `
        <section id="stats">
            <canvas id="chart" width="600" height="400"></canvas>
        </section>
    `
})
@CanActivate(() => isAdmin())
export default class TortendiagrammBewertungen implements OnInit {
    private _elementIdChart: string = 'chart';

    constructor(private _buecherService: BuecherService) {
        console.log('TortenDiagrammBewertungen.constructor()');
    }

    onInit(): void { this._buecherService.setPieChart(this._elementIdChart); }

    toString(): string {
        return `TortenDiagrammBewertungen: {elementIdChart: ${this._elementIdChart}}`;
    }
}
