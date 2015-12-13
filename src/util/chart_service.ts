/// <reference path="../../node_modules/chart/Chart.d.ts" />

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

// Charts mittes JavaScript, siehe http://www.jsgraphs.com und
// http://jqueryhouse.com/javascript-chart-and-graph-libraries
// - D3: fuehrend, flexibel, aber keine vorgefertigten Layouts fuer z.B.
// Balken-Diagramme
// - Google Charts: nur online benutzbar, JS-Datei *nicht* auf eigenem Server
// benutzbar
// - Chart.js
// - ...

import {Injectable} from 'angular2/angular2';
// in Chart.d.ts gibt es urspruengl. das Interface Chart (-> IChart) und die
// Variable Chart
import {IChart, ChartSettings} from 'chart/Chart';

import {isBlank, log} from './util';

interface ColorHighlight {
    color: string;
    highlight: string;
}

declare var Chart: {
    new (context: CanvasRenderingContext2D): IChart;
    defaults: { global: ChartSettings; }
};

@Injectable()
export class ChartService {
    private colorsPie: Map<number, ColorHighlight> =
        new Map<number, ColorHighlight>();

    constructor() {
        console.log('ChartService.constructor()');

        this.colorsPie.set(0, {color: '#F7464A', highlight: '#FF5A5E'});  // red
        this.colorsPie.set(
            1, {color: '#46BFBD', highlight: '#5AD3D1'});  // green
        this.colorsPie.set(
            2, {color: '#FDB45C', highlight: '#FFC870'});  // yellow
    }

    @log
    getChart(elementId: string): IChart {
        const chartElement: HTMLCanvasElement =
            <HTMLCanvasElement>document.getElementById(elementId);
        if (isBlank(chartElement)) {
            return null;
        }
        const ctx: CanvasRenderingContext2D =
            <CanvasRenderingContext2D>chartElement.getContext('2d');
        return new Chart(ctx);
    }

    getColorPie(idx: number): string {
        return this.colorsPie.get(idx % 3).color;
    }

    getHighlightPie(idx: number): string {
        return this.colorsPie.get(idx % 3).highlight;
    }

    toString(): string {
        return `ChartService: {colorsPie: ${this.colorsPie}}`;
    }
}
