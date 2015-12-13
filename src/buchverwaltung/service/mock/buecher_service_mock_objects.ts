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
import {Response, ResponseOptions} from 'angular2/http';
import moment from 'moment/moment';

import {
    ChartDataSet,
    LinearChartData,
    CircularChartData,
    IChart
} from 'chart/Chart';
import _ from 'lodash/lodash';

import Buch from '../../model/buch';
import {IBuchServer, IBuchForm} from '../../model/buch';
import AbstractBuecherService from '../abstract_buecher_service';
import BuecherService from '../buecher_service';
import BUECHER from './buecher';
import {uuid, rating} from '../../../util/mock';
import {
    ChartService,
    isEmpty,
    isBlank,
    isPresent,
    log
} from '../../../util/util';

// Services
// - wiederverwendbarer Code: in ggf. verschiedenen Controller
// - Zugriff auf Daten, z.B. durch Aufruf von RESTful Web Services
// - View (HTML-Template) <- Controller <- Service

export default class BuecherServiceMockObjects extends AbstractBuecherService {
    private _alleBuecher: Array<Buch> =
        BUECHER.map((b: IBuchServer) => { return Buch.fromServer(b); });
    private _buecher: Array<Buch> = [];
    private _buch: Buch = null;

    constructor(@Inject(ChartService) private _chartService: ChartService) {
        super();
        console.log(
            `BuecherServiceMockObjects.constructor(): lodash=${_.VERSION}, alleBuecher=`,
            this._alleBuecher);
    }

    get buecher(): Array<Buch> { return this._buecher; }

    set buecher(buecher: Array<Buch>) {
        console.log('BuecherServiceMockObjects.set buecher()', buecher);
        this._buecher = buecher;
    }

    get buch(): Buch { return this._buch; }

    set buch(buch: Buch) {
        console.log('BuecherServiceMockObjects.set buch()', buch);
        this._buch = buch;
    }

    @log
    find(
        suchkriterien: IBuchForm,
        successHandler: (buecher: Array<Buch>) => void,
        errorHandler: (response: Response) => void): void {
        this._buecher = this._alleBuecher;

        const {titel, verlag, schnulze, scienceFiction}: any = suchkriterien;

        if (!isEmpty(titel)) {
            this._buecher =
                this._buecher.filter((buch: Buch) => buch.containsTitel(titel));
        }
        if (!isEmpty(verlag)) {
            this._buecher =
                this._buecher.filter((buch: Buch) => buch.hasVerlag(verlag));
        }
        if (schnulze) {
            this._buecher = this._buecher.filter(
                (buch: Buch) => buch.hasSchlagwort('SCHNULZE'));
        }
        if (scienceFiction) {
            this._buecher = this._buecher.filter(
                (buch: Buch) => buch.hasSchlagwort('SCIENCE_FICTION'));
        }

        if (this._buecher.length === 0) {
            const options: ResponseOptions = new ResponseOptions({
                status: 404,
                body: 'Response durch BuecherServiceMockObjects'
            });
            const response: Response = new Response(options);
            console.log(
                'BuecherServiceMockObjects.find(): response=', response);
            errorHandler(response);
            return;
        }
        successHandler(this._buecher);
        console.log(
            'BuecherServiceMockObjects.find(): _buecher=', this._buecher);
    }

    @log
    findById(id: string, errorHTTP: (response: Response) => void): void {
        // Gibt es ein gepuffertes Buch mit der gesuchten ID?
        if (isPresent(this._buch) && this._buch.id === id) {
            return;
        }
        if (isBlank(id)) {
            return;
        }

        if (isBlank(this._alleBuecher)) {
            this._buch = null;
            return;
        }

        this._buch = this._alleBuecher.find((buch: Buch) => buch.id === id);
        if (this._buch === undefined) {
            this._buch = null;
        }
    }

    @log
    save(
        neuesBuch: Buch, successHTTP: () => void,
        errorHTTP: (response: Response) => void): void {
        if (isBlank(this._alleBuecher)) {
            this._alleBuecher = [];
        }

        neuesBuch.id = uuid();
        neuesBuch.rating = rating();
        neuesBuch.datum = moment(new Date());
        this._alleBuecher.push(neuesBuch);

        successHTTP();
    }

    @log
    update(
        buch: Buch, successHTTP: () => void,
        errorHTTP: (response: Response) => void): void {
        for (let i: number = 0; i < this._alleBuecher.length; i++) {
            if (this._alleBuecher[i].id === buch.id) {
                this._alleBuecher[i] = buch;
                console.log('alleBuecher=', this._alleBuecher);
                successHTTP();
                return;
            }
        }

        this._alleBuecher.push(buch);
        console.log('alleBuecher=', this._alleBuecher);
        successHTTP();
    }

    @log
    remove(
        buch: Buch, successHTTP: () => void,
        errorHTTP: (response: Response) => void): void {
        this._buecher = this._buecher.filter((b: Buch) => b.id !== buch.id);
    }

    @log
    setBarChart(elementIdChart: string): void {
        const buecher: Array<Buch> = this._alleBuecher;
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
            'BuecherServiceMockObjects.setBarChart(): labels: ', labels);

        const chart: IChart = this._chartService.getChart(elementIdChart);
        if (isPresent(chart) && isPresent(datasets[0].data)
            && datasets[0].data.length !== 0) {
            // TODO legendTemplate ergaenzen
            chart.Bar(data);
        }
    }

    @log
    setLinearChart(elementIdChart: string): void {
        const buecher: Array<Buch> = this._alleBuecher;
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

    @log
    setPieChart(elementIdChart: string): void {
        const buecher: Array<Buch> = this._alleBuecher;
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

    toString(): String {
        /* tslint:disable:max-line-length */
        return `BuecherServiceMockObjects: {buecher: ${JSON.stringify(this._buecher, null, 2)}}`;
        /* tslint:enable:max-line-length */
    }
}

export const MOCK_OBJECTS_PROVIDER: Provider =
    provide(BuecherService, {useClass: BuecherServiceMockObjects});
