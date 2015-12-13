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
import {Http, Response, Headers} from 'angular2/http';
import {
    ChartDataSet,
    LinearChartData,
    CircularChartData,
    IChart
} from 'chart/Chart';
import moment from 'moment/moment';

import Buch from '../../model/buch';
import {IBuchServer, IBuchForm} from '../../model/buch';
import AbstractBuecherService from '../abstract_buecher_service';
import BuecherService from '../buecher_service';
import {
    ChartService,
    SCHEME,
    SERVERNAME,
    PORT,
    BASE_PATH_BUECHER,
    isPresent,
    isBlank,
    isEmpty,
    log
} from '../../../util/util';
import {rating} from '../../../util/mock';

// Methoden der Klasse Http: für vereinfachten Zugriff auf XMLHttpRequest
//  * get(url, options) – HTTP GET request
//  * post(url, body, options) – HTTP POST request
//  * put(url, body, options) – HTTP PUT request
//  * patch(url, body, options) – HTTP PATCH request
//  * delete(url, options) – HTTP DELETE request

export default class BuecherServiceMockServer extends AbstractBuecherService {
    private _baseUriBuecher: string;
    private _buch: Buch = null;

    constructor(
        @Inject(ChartService) private _chartService: ChartService,
        @Inject(Http) private _http: Http, @Inject(SCHEME) scheme: string,
        @Inject(PORT) port: number) {
        super();
        this._baseUriBuecher =
            `${scheme}:${SERVERNAME}:${port}${BASE_PATH_BUECHER}`;
        console.log(
            'BuecherServiceMockServer.constructor(): baseUriBuecher',
            this._baseUriBuecher);
    }

    get buch(): Buch { return this._buch; }

    set buch(buch: Buch) {
        console.log('BuecherServiceMockServer.set buch()', buch);
        this._buch = buch;
    }

    /**
     * {method} find
     * Buecher suchen
     * @param {Object} suchkriterien Die Suchkriterien
     * @param {Function} errorHandler Die Function fuer status !== OK
     */
    @log
    find(
        suchkriterien: IBuchForm,
        successHandler: (buecher: Array<Buch>) => void,
        errorHandler: (response: Response) => void): void {
        // TODO Query-Parameter setzen
        const uri: string = this._baseUriBuecher;
        const successHandlerMock: Function = (response: Response) => {
            let buecher: Array<Buch> = this._responseToArrayBuch(response);
            buecher = this._filterFind(buecher, suchkriterien);
            if (buecher.length === 0) {
                response.status = 404;
                errorHandler(response);
                return;
            }
            successHandler(buecher);
        };
        const nextHandler: ((response: Response) => void) =
            (response: Response) => {
                console.log('BuecherServiceMockServer.find(): nextHandler()');
                if (response.status === 200) {
                    successHandlerMock(response);
                    return;
                }
                if (isPresent(errorHandler)) {
                    errorHandler(response);
                }
            };

        // Die Daten werden vom (REST-) Server *asynchron* geliefert.
        // Deshalb gibt die Methode get() vom Service Http ein *Observable*
        // zurueck.
        // Ein Observable ist eine Alternative zu Callback (Hell), Promise, ...
        // Ein Observable kann andere Objekte ueber Aenderungen informieren,
        // falls diese dafuer ein Abbonnement durch die Methode subscribe()
        // haben. Diese Aenderungen koennen sukzessive in der Function
        // nextHandler ermittelt werden.
        // Die Klasse Observable ist im Modul
        // jspm_packages\npm\@reactivex\rxjs@VERSION\dist\cjs\Observable.
        // http://reactivex.io ist von Netflix unter Mitarbeit von Microsoft
        // Uebrigens: RxJS wurde als RxJava nach Java portiert:
        // https://github.com/ReactiveX/RxJava/wiki
        // https://github.com/jhusain/learnrxjava
        this._http.get(uri).subscribe(nextHandler);
    }

    /**
     * {method} findById
     * Ein Buch anhand der ID suchen
     * @param {string} id Die ID des gesuchten Buchs
     * @param {Function} errorHandler Eine Function fuer status !== OK
     */
    @log
    findById(id: string, errorHandler: (response: Response) => void): void {
        // Gibt es ein gepuffertes Buch mit der gesuchten ID?
        if (isPresent(this._buch) && this._buch.id === id) {
            return;
        }
        if (isBlank(id)) {
            return;
        }

        const uri: string = `${this._baseUriBuecher}/${id}`;
        const success: Function = (response: Response) => {
            this._buch = this._responseToBuch(response);
        };
        const next: ((response: Response) => void) = (response: Response) => {
            if (response.status === 200) {
                success(response);
                return;
            }
            if (isPresent(errorHandler)) {
                errorHandler(response);
            }
        };

        this._http.get(uri).subscribe(next);
    }

    /**
     * {method} save
     * Ein neues Buch anlegen
     * @param {Object} neuesBuch Das JSON-Objekt mit dem neuen Buch
     * @param {Function} successHandler Eine Function fuer status === CREATED
     * @param {Function} errorHandler Eine Function fuer status !== CREATED
     */
    @log
    save(
        neuesBuch: Buch, successHandler: () => void,
        errorHandler: (response: Response) => void): void {
        // Attribut id wird durch json-server generiert
        neuesBuch.rating = rating();
        neuesBuch.datum = moment(new Date());

        const uri: string = this._baseUriBuecher;
        const body: string = JSON.stringify(neuesBuch.toJSON());
        const headers: Headers =
            new Headers({'Content-Type': 'application/json'});
        // RequestOptionsArgs in
        // jspm_packages\npm\angular2@VERSION\ts\src\http\interfaces.ts
        const options: any = {headers: headers};
        const next: ((response: Response) => void) = (response: Response) => {
            if (response.status === 201) {
                successHandler();
                return;
            }
            if (isPresent(errorHandler)) {
                errorHandler(response);
            }
        };

        console.log('body=', body);
        this._http.post(uri, body, options).subscribe(next);
    }

    /**
     * {method} update
     * Ein vorhandenes Buch aktualisieren
     * @param {Object} buch Das JSON-Objekt mit den aktualisierten Buchdaten
     * @param {Function} successHandler Eine Function fuer status === NO_CONTENT
     * @param {Function} errorHandler Eine Function fuer status !== NO_CONTENT
     */
    @log
    update(
        buch: Buch, successHandler: () => void,
        errorHandler: (response: Response) => void): void {
        // json-server erwartet bei einem PUT-Request am Pfadende die ID
        const uri: string = `${this._baseUriBuecher}/${buch.id}`;
        const body: string = JSON.stringify(buch.toJSON());
        const headers: Headers =
            new Headers({'Content-Type': 'application/json'});
        // RequestOptionsArgs in
        // jspm_packages\npm\angular2@VERSION\ts\src\http\interfaces.ts
        const options: any = {headers: headers};
        const next: ((response: Response) => void) = (response: Response) => {
            // json-server liefert bei erfolgreichem PUT-Request 200 (nicht 204)
            if (response.status === 200) {
                successHandler();
                return;
            }
            if (isPresent(errorHandler)) {
                errorHandler(response);
            }
        };

        console.log('body=', body);
        this._http.put(uri, body, options).subscribe(next);
    }

    /**
     * {method} remove
     * Ein Buch loeschen
     * @param {Object} buch Das JSON-Objekt mit dem zu loeschenden Buch
     * @param {Function} successHandler Eine Function fuer status === NO_CONTENT
     * @param {Function} errorHandler Eine Function fuer status !== NO_CONTENT
     */
    @log
    remove(
        buch: Buch, successHandler: () => void,
        errorHandler: (response: Response) => void): void {
        // json-server erwartet bei einem DELETE-Request am Pfadende die ID
        const uri: string = `${this._baseUriBuecher}/${buch.id}`;
        const next: ((response: Response) => void) = (response: Response) => {
            // json-server liefert bei erfolgreichem DELETE-Request 200 (nicht
            // 204)
            if (response.status === 200) {
                if (isPresent(successHandler)) {
                    successHandler();
                }
                return;
            }
            if (isPresent(errorHandler)) {
                errorHandler(response);
            }
        };

        this._http.delete(uri).subscribe(next);
    }

    @log
    setBarChart(elementIdChart: string): void {
        const uri: string = this._baseUriBuecher;
        const success: Function = (response: Response) => {
            this._createBarChart(
                elementIdChart, this._responseToArrayBuch(response));
        };
        const error: Function = (response: Response) => {
            console.error('Fehler beim Serverzugriff: response=', response);
        };
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
        const error: Function = (response: Response) => {
            console.error('Fehler beim Serverzugriff: response=', response);
        };
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
        const error: Function = (response: Response) => {
            console.error('Fehler beim Serverzugriff: response=', response);
        };
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
        /* tslint:disable:max-line-length */
        return `BuecherServiceMockServer: {buch: ${JSON.stringify(this._buch, null, 2)}}`;
        /* tslint:enable:max-line-length */
    }

    @log
    private _responseToArrayBuch(response: Response): Array<Buch> {
        const jsonArray: Array<IBuchServer> =
            <Array<IBuchServer>>(response.json());
        return jsonArray.map((jsonObjekt: IBuchServer) => {
            return Buch.fromServer(jsonObjekt);
        });
    }

    @log
    private _responseToBuch(response: Response): Buch {
        const jsonObjekt: IBuchServer = <IBuchServer>(response.json());
        return Buch.fromServer(jsonObjekt);
    }

    @log
    private _filterFind(buecher: Array<Buch>, suchkriterien: IBuchForm):
        Array<Buch> {
        const {titel, verlag, schnulze, scienceFiction}: any = suchkriterien;

        if (!isEmpty(titel)) {
            buecher = buecher.filter(
                (buch: Buch) =>
                    buch.titel.toLowerCase().includes(titel.toLowerCase()));
        }
        if (!isEmpty(verlag)) {
            buecher = buecher.filter((buch: Buch) => buch.verlag === verlag);
        }
        if (schnulze) {
            buecher = buecher.filter(
                (buch: Buch) =>
                    buch.schlagwoerter.find(
                        (schlagwort: string) => schlagwort === 'SCHNULZE')
                    !== undefined);
        }
        if (scienceFiction) {
            buecher = buecher.filter(
                (buch: Buch) => buch.schlagwoerter.find(
                                    (schlagwort: string) =>
                                        schlagwort === 'SCIENCE_FICTION')
                                !== undefined);
        }
        console.log('buecher=', buecher);
        return buecher;
    }

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
        console.log(
            'BuecherServiceMockServer._createBarChart(): labels: ', labels);

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

        // TODO Chart.js 2.0: Das Datenmodell hat sich in geaendert
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

export const MOCK_SERVER_PROVIDER: Provider =
    provide(BuecherService, {useClass: BuecherServiceMockServer});
