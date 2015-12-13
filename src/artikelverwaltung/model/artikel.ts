import {isBlank, isPresent} from '../../util/util';


const MIN_RATING: number = 0;
const MAX_RATING: number = 5;

export interface IArtikelCommon {
    id: number;
    rating: number;
    ausgesondert: boolean;
}


export interface IArtikelServer extends IArtikelCommon {
    version?: number;
    bezeichnung: string;
    preis: number;
    kategorie: Array<string>;   
}

export interface IArtikelForm extends IArtikelCommon {
    bezeichnung: string;
    preis: string;
    version: string;
    bad: boolean;
    buero: boolean;
    diele: boolean;
    esszimmer: boolean;
    kinderzimmer: boolean;
    kueche: boolean;
    schlafzimmer: boolean;
    wohnzimmer: boolean;
}


export interface IArtWrapper { art: string; }

export default class Artikel {
    public ratingArray: Array<boolean> = [];

    constructor(
        public id: number, public bezeichnung: string, public rating: number,
        public version: number, public preis: number,
        public kategorie: Array<string>) {
        this.id = id || null;
        this.bezeichnung = bezeichnung || null;
        this.rating = rating || null;
        this.version = version || null;
        this.preis = preis || null;
        this.kategorie =
            isPresent(kategorie) && kategorie.length !== 0 ?
                kategorie :
                [];
        for (let i: number = MIN_RATING; i < rating; i++) {
            this.ratingArray.push(true);
        }
        for (let i: number = this.rating; i < MAX_RATING; i++) {
            this.ratingArray.push(false);
        }
    }   


 static fromServer(artikel: IArtikelServer): Artikel {
        return new Artikel(
         artikel.id,  artikel.bezeichnung, artikel.rating, artikel.version, artikel.preis, artikel.kategorie);
    }

    static fromForm(artikel: IArtikelForm, art: IArtWrapper): Artikel {
        const kategorie: Array<string> = [];
        if (artikel.bad) {
            kategorie.push('BAD');
        }
        if (artikel.buero) {
            kategorie.push('BUERO');
        }
        if (artikel.diele) {
            kategorie.push('DIELE');
        }
        if (artikel.esszimmer) {
            kategorie.push('ESSZIMMER');
        }
        if (artikel.kinderzimmer) {
            kategorie.push('KINDERZIMMER');
        }
        if (artikel.kueche) {
            kategorie.push('KUECHE');
        }
        if (artikel.schlafzimmer) {
            kategorie.push('SCHLAFZIMMER');
        }
        if (artikel.wohnzimmer) {
            kategorie.push('WOHNZIMMER');
        }
        return new Artikel(
            artikel.id, artikel.bezeichnung, artikel.rating, parseInt(artikel.version, 10), 
            parseInt(artikel.preis, 10),kategorie);
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
}