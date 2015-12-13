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

import {isBlank, isPresent} from '../../util/util';

// https://github.com/urish/angular2-moment/blob/master/TimeAgoPipe.ts
import moment from 'moment/moment';
import {Moment} from 'moment/moment';

const MIN_RATING: number = 0;
const MAX_RATING: number = 5;

export interface IBuchCommon {
    id?: string;
    titel?: string;
    rating?: number;
    verlag?: string;
    datum: string;
}

// Daten vom und fuer den REST-Server
export interface IBuchServer extends IBuchCommon {
    preis: number;
    rabatt: number;
    art?: string;
    schlagwoerter?: Array<string>;
}

// In einem Formular: je 1 Control fuer jede Checkbox und Radiobutton
export interface IBuchForm extends IBuchCommon {
    preis: string;
    rabatt: string;
    schnulze?: boolean;
    scienceFiction?: boolean;
}

// Workaround, weil es fuer Radiobuttons kein Control gibt
export interface IArtWrapper { art: string; }

// Model als Plain-Old-JavaScript-Object (POJO) fuer die Daten *UND*
// Functions fuer Abfragen und Aenderungen, z.B. fuer Initialisierung
// mit JSON-Daten vom REST-Server oder fuer Aenderungen in einem Formuluar
// oder Umrechnungen in z.B. Euro oder Prozent
export default class Buch {
    public ratingArray: Array<boolean> = [];
    public datum: Moment;

    // wird i.a. nicht direkt aufgerufen, sondern Buch.fromServer oder
    // Buch.fromForm
    constructor(
        public id: string, public titel: string, public rating: number,
        public art: string, public verlag: string, public preis: number,
        public rabatt: number, datum: string,
        public schlagwoerter: Array<string>) {
        this.id = id || null;
        this.titel = titel || null;
        this.rating = rating || null;
        this.art = art || null;
        this.verlag = verlag || null;
        this.preis = preis || null;
        this.rabatt = rabatt || null;
        this.datum = isPresent(datum) ? moment(datum) : null;
        this.schlagwoerter =
            isPresent(schlagwoerter) && schlagwoerter.length !== 0 ?
                schlagwoerter :
                [];
        for (let i: number = MIN_RATING; i < rating; i++) {
            this.ratingArray.push(true);
        }
        for (let i: number = this.rating; i < MAX_RATING; i++) {
            this.ratingArray.push(false);
        }
    }

    static fromServer(buch: IBuchServer): Buch {
        return new Buch(
            buch.id, buch.titel, buch.rating, buch.art, buch.verlag, buch.preis,
            buch.rabatt, buch.datum, buch.schlagwoerter);
    }

    static fromForm(buch: IBuchForm, art: IArtWrapper): Buch {
        const schlagwoerter: Array<string> = [];
        if (buch.schnulze) {
            schlagwoerter.push('SCHNULZE');
        }
        if (buch.scienceFiction) {
            schlagwoerter.push('SCIENCE_FICTION');
        }
        // preis und rabatt muss von string in number konvertiert werden
        return new Buch(
            buch.id, buch.titel, buch.rating, art.art, buch.verlag,
            parseInt(buch.preis, 10), parseInt(buch.rabatt, 10) / 100,
            buch.datum, schlagwoerter);
    }

    // http://momentjs.com
    get datumFormatted(): string { return this.datum.format('Do MMM YYYY'); }

    get datumFromNow(): string { return this.datum.fromNow(); }

    containsTitel(titel: string): boolean {
        return this.titel.toLowerCase().includes(titel.toLowerCase());
    }

    rateUp(): void {
        if (this.rating < MAX_RATING) {
            this.rating++;
        }
    }

    rateDown(): void {
        if (this.rating > MIN_RATING) {
            this.rating--;
        }
    }

    hasVerlag(verlag: string): boolean { return this.verlag === verlag; }

    updateStammdaten(
        titel: string, rating: number, art: string, verlag: string,
        preis: number, rabatt: number): void {
        this.titel = titel;
        this.rating = rating;
        this.art = art;
        this.verlag = verlag;
        this.preis = preis;
        this.rabatt = rabatt;
    }

    hasSchlagwoerter(): boolean { return this.schlagwoerter.length !== 0; }

    hasSchlagwort(schlagwort: string): boolean {
        return this.schlagwoerter.find((s: string) => s === schlagwort)
               !== undefined;
    }

    updateSchlagwoerter(schnulze: boolean, scienceFiction: boolean): void {
        this._resetSchlagwoerter();
        if (schnulze) {
            this._addSchlagwort('SCHNULZE');
        }
        if (scienceFiction) {
            this._addSchlagwort('SCIENCE_FICTION');
        }
    }

    toString(): string { return JSON.stringify(this, null, 2); }

    toJSON(): IBuchServer {
        return {
            id: this.id,
            titel: this.titel,
            rating: this.rating,
            art: this.art,
            verlag: this.verlag,
            schlagwoerter: this.schlagwoerter,
            preis: this.preis,
            rabatt: this.rabatt,
            datum: this.datum.format('YYYY-MM-DD')
        };
    }

    _resetSchlagwoerter(): void { this.schlagwoerter = []; }

    _addSchlagwort(schlagwort: string): void {
        if (isBlank(this.schlagwoerter)) {
            this.schlagwoerter = [];
        }
        this.schlagwoerter.push(schlagwort);
    }
}
