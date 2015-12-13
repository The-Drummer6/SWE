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

import {Response} from 'angular2/http';

import Buch from '../model/buch';
import {IBuchForm} from '../model/buch';

abstract class AbstractBuecherService {
    abstract find(
        suchkriterien: IBuchForm,
        successHandler: (buecher: Array<Buch>) => void,
        errorHandler: (response: Response) => void): void;

    abstract findById(id: string, errorHTTP: (response: Response) => void):
        void;

    abstract save(
        neuesBuch: Buch, successHTTP: () => void,
        errorHTTP: (response: Response) => void): void;

    abstract update(
        buch: Buch, successHTTP: () => void,
        errorHTTP: (response: Response) => void): void;

    abstract remove(
        buch: Buch, successHTTP: () => void,
        errorHTTP: (response: Response) => void): void;

    abstract setBarChart(elementIdChart: string): void;

    abstract setLinearChart(elementIdChart: string): void;

    abstract setPieChart(elementIdChart: string): void;
}

export default AbstractBuecherService;
