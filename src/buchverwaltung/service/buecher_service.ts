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

import {Inject, provide, Provider} from 'angular2/angular2';
import {Http, Response} from 'angular2/http';
import {
    ChartDataSet,
    LinearChartData,
    CircularChartData,
    IChart
} from 'chart/Chart';

import Buch from '../model/buch';
import {IBuchServer, IBuchForm} from '../model/buch';
import AbstractBuecherService from './abstract_buecher_service';
import {
    ChartService,
    SCHEME,
    SERVERNAME,
    PORT,
    BASE_PATH_BUECHER,
    isPresent,
    log
} from '../../util/util';

// Methoden der Klasse Http
//  * get(url, options) – HTTP GET request
//  * post(url, body, options) – HTTP POST request
//  * put(url, body, options) – HTTP PUT request
//  * patch(url, body, options) – HTTP PATCH request
//  * delete(url, options) – HTTP DELETE request

// Eine Service-Klasse ist eine "normale" Klasse gemaess ES 2015, die mittels
// DI in eine Komponente injiziert werden kann.
// Eine Komponente realisiert gemaess MVC-Pattern den Controller und die View.
// Die Anwendungslogik wird vom Controller an Service-Klassen delegiert.
export default class BuecherService extends AbstractBuecherService {
    private _baseUriBuecher: string;
    private _buecher: Array<Buch> = [];
    private _buch: Buch = null;

    constructor(
        @Inject(ChartService) private _chartService: ChartService,
        @Inject(Http) private _http: Http, @Inject(SCHEME) scheme: string,
        @Inject(PORT) port: number) {
        super();
        this._baseUriBuecher =
            `${scheme}:${SERVERNAME}:${port}${BASE_PATH_BUECHER}`;
        console.log(
            'BuecherService.constructor(): baseUriBuecher',
            this._baseUriBuecher);
    }

    get buecher(): Array<Buch> { return this._buecher; }

    set buecher(buecher: Array<Buch>) {
        console.log('BuecherService.set buecher()', buecher);
        this._buecher = buecher;
    }

    get buch(): Buch { return this._buch; }

    set buch(buch: Buch) {
        console.log('BuecherService.set buch()', buch);
        this._buch = buch;
    }

    /**
     * Buecher suchen
     * @param values Die Suchkriterien
     * @param error Die Callback-Function fuer den Fehlerfall
     */
    @log
    find(
        values: IBuchForm, successHandler: (buecher: Array<Buch>) => void,
        errorHandler: (response: Response) => void): void {
        throw new Error('NOT YET IMPLEMENTED');
    }

    /**
     * Ein Buch anhand der ID suchen
     * @param id Die ID des gesuchten Buchs
     * @param error Eine Callback-Function fuer den Fehlerfall
     */
    @log
    findById(id: string, errorHTTP: (response: Response) => void): void {
        throw new Error('NOT YET IMPLEMENTED');
    }

    /**
     * Ein neues Buch anlegen
     * @param neuesBuch Das JSON-Objekt mit dem neuen Buch
     */
    @log
    save(
        neuesBuch: Buch, successHTTP: () => void,
        errorHTTP: (response: Response) => void): void {
        throw new Error('NOT YET IMPLEMENTED');
    }

    /**
     * Ein vorhandenes Buch aktualisieren
     * @param buch Das JSON-Objekt mit den aktualisierten Buchdaten
     */
    @log
    update(
        buch: Buch, successHTTP: () => void,
        errorHTTP: (response: Response) => void): void {
        throw new Error('NOT YET IMPLEMENTED');
    }

    /**
     * Ein Buch loeschen
     * @param buch Das JSON-Objekt mit dem zu loeschenden Buch
     */
    @log
    remove(
        buch: Buch, successHTTP: () => void,
        errorHTTP: (response: Response) => void): void {
        throw new Error('NOT YET IMPLEMENTED');
    }

    @log
    setBarChart(elementIdChart: string): void {
        const uri: string = this._baseUriBuecher;
        const success: Function = (response: Response) => {
            this._createBarChart(
                elementIdChart, this._responseToArrayBuch(response));
        };
        const error: Function =
            (response: Response) => { console.error('response=', response); };
        const next: ((response: Response) => void) = (response: Response) => {
            if (response.status === 200) {
                success(response);
                return;
            }
            error(response);
        };

        this._http.get(uri).subscribe(next);
    }

    @log
    setLinearChart(elementIdChart: string): void {
        const uri: string = this._baseUriBuecher;
        const success: Function = (response: Response) => {
            this._createLineChart(
                elementIdChart, this._responseToArrayBuch(response));
        };
        const error: Function =
            (response: Response) => { console.error('response=', response); };
        const next: ((response: Response) => void) = (response: Response) => {
            if (response.status === 200) {
                success(response);
                return;
            }
            error(response);
        };

        this._http.get(uri).subscribe(next);
    }

    @log
    setPieChart(elementIdChart: string): void {
        const uri: string = this._baseUriBuecher;
        const success: Function = (response: Response) => {
            this._createPieChart(
                elementIdChart, this._responseToArrayBuch(response));
        };
        const error: Function =
            (response: Response) => { console.error('response=', response); };
        const next: ((response: Response) => void) = (response: Response) => {
            if (response.status === 200) {
                success(response);
                return;
            }
            error(response);
        };

        this._http.get(uri).subscribe(next);
    }

    toString(): String {
        return `BuecherService: {buecher: ${JSON.stringify(this._buecher, null, 2)}}`;
    }

    @log
    private _responseToArrayBuch(response: Response): Array<Buch> {
        const jsonArray: Array<IBuchServer> =
            <Array<IBuchServer>>(response.json());
        return jsonArray.map((jsonObjekt: IBuchServer) => {
            return Buch.fromServer(jsonObjekt);
        });
    }

    // @log
    // private _responseToBuch(response: Response): Buch {
    //     const jsonObjekt: IBuchServer = <IBuchServer>(response.json());
    //     return Buch.fromServer(jsonObjekt);
    // }

    private _createBarChart(elementIdChart: string, buecher: Array<Buch>):
        void {
        const labels: Array<string> = buecher.map((buch: Buch) => buch.id);
        const datasets: Array<ChartDataSet> = [
            {
              label: 'Bewertungen',
              fillColor: 'rgba(220,220,220,0.2)',
              strokeColor: 'rgba(220,220,220,1)',
              data: buecher.map((buch: Buch) => buch.rating)
            }
        ];
        const data: LinearChartData = {labels: labels, datasets: datasets};
        console.log('BuecherService._createBarChart(): labels: ', labels);

        const chart: IChart = this._chartService.getChart(elementIdChart);
        if (isPresent(chart) && isPresent(datasets[0].data)
            && datasets[0].data.length !== 0) {
            // TODO legendTemplate ergaenzen
            chart.Bar(data);
        }
    }

    private _createLineChart(elementIdChart: string, buecher: Array<Buch>):
        void {
        const labels: Array<string> = buecher.map((buch: Buch) => buch.id);
        const datasets: Array<ChartDataSet> = [
            {
              label: 'Bewertungen',
              fillColor: 'rgba(220,220,220,0.2)',
              strokeColor: 'rgba(220,220,220,1)',
              data: buecher.map((buch: Buch) => buch.rating)
            }
        ];
        const data: LinearChartData = {labels: labels, datasets: datasets};

        // TODO Das Datenmodell fuer Chart.js hat sich in 2.0 geaendert
        //      https://github.com/nnnick/Chart.js/blob/v2.0-alpha/README.md
        //      chart.d.ts gibt es noch nicht fuer 2.0
        const chart: IChart = this._chartService.getChart(elementIdChart);
        if (isPresent(chart) && isPresent(datasets[0].data)
            && datasets[0].data.length !== 0) {
            chart.Line(data);
        }
    }

    private _createPieChart(elementIdChart: string, buecher: Array<Buch>):
        void {
        const pieData: Array<CircularChartData> =
            new Array<CircularChartData>(buecher.length);
        buecher.forEach((buch: Buch, i: number) => {
            const data: CircularChartData = {
                value: buch.rating,
                color: this._chartService.getColorPie(i),
                highlight: this._chartService.getHighlightPie(i),
                label: `${buch.id}`
            };
            pieData[i] = data;
        });

        const chart: IChart = this._chartService.getChart(elementIdChart);
        if (isPresent(chart) && pieData.length !== 0) {
            chart.Pie(pieData);
        }
    }
}

export const BUECHER_SERVICE_PROVIDER: Provider =
    provide(BuecherService, {useClass: BuecherService});
