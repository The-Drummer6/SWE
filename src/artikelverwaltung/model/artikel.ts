import {isBlank, isPresent} from '../../util/util';

const MIN_RATING: number = 0;
const MAX_RATING: number = 5;

export interface IArtikelCommon {
    id?: string;
    bezeichnung: string;
	preis: number;
    rating?: number;
    ausgesondert?: boolean;
    version?: number;
}

// Daten vom und fuer den REST-Server
export interface IArtikelServer extends IArtikelCommon {
    
    kategorie?: Array<string>;
}

// In einem Formular: je 1 Control fuer jede Checkbox und Radiobutton??
export interface IArtikelForm extends IArtikelCommon {
    bad?: boolean;
    buero?: boolean;
    diele?: boolean;
    esszimmer?: boolean;
    kinderzimmer?: boolean;
    kueche?: boolean;
    schlafzimmer?: boolean;
    wohnzimmer?: boolean;
}


export default class Artikel {
   public ratingArray: Array<boolean> = []; 
   
    constructor(
        public id: string, public bezeichnung: string, public rating: number,
        public version: number, public ausgesondert: boolean, public preis: number,
        public kategorie: Array<string>) {
        this.id = id || null;
        this.bezeichnung = bezeichnung || null;
        this.rating = rating || null;
        this.version = version || null;
        this.ausgesondert = ausgesondert || null;
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
            artikel.id, artikel.bezeichnung, artikel.rating, artikel.version, artikel.ausgesondert,artikel.preis,
            artikel.kategorie);
    }
    static fromForm(artikel: IArtikelForm): Artikel {
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
        // preis muss von string in number konvertiert werden
        return new Artikel(
            artikel.id, artikel.bezeichnung, artikel.rating, artikel.version,
            artikel.ausgesondert,
            artikel.preis,
             kategorie);
    }
    
   /* containsTitel(bezeichnung: string): boolean {
        return this.bezeichnung.toLowerCase().includes(bezeichnung.toLowerCase());
    }
    */

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

    hasAusgesondert(ausgesondert: boolean): boolean { return this.ausgesondert === ausgesondert; }

    updateStammdaten(
        bezeichnung: string, rating: number,
        preis: number, ausgesondert: boolean, version: number): void {
        this.bezeichnung = bezeichnung;
        this.rating = rating;
        this.preis = preis;
        this.ausgesondert = ausgesondert
        this.version = version;
    }

    hasKategorien(): boolean { return this.kategorie.length !== 0; }

    hasKategorie(kategorie: string): boolean {
        return this.kategorie.find((s: string) => s === kategorie)
               !== undefined;
    }

    updateKategorie(bad: boolean, buero: boolean, diele: boolean, esszimmer: boolean, kinderzimmer: boolean, kueche: boolean, schlafzimmer: boolean, wohnzimmer: boolean): void {
        this._resetKategorie();
        if (bad) {
            this._addKategorie('BAD');
        }
        if (buero) {
            this._addKategorie('BUERO');
        }
        if (diele) {
            this._addKategorie('DIELE');
        }
        if (esszimmer) {
            this._addKategorie('ESSZIMMER');
        }
        if (kinderzimmer) {
            this._addKategorie('KINDERZIMMER');
        }
        if (kueche) {
            this._addKategorie('KUECHE');
        }
        if (schlafzimmer) {
            this._addKategorie('SCHLAFZIMMER');
        }
        if (wohnzimmer) {
            this._addKategorie('WOHNZIMMER');
        }
    }
     toString(): string { return JSON.stringify(this, null, 2); }

    toJSON(): IArtikelServer {
        return {
            id: this.id,
            bezeichnung: this.bezeichnung,
            rating: this.rating,
            ausgesondert: this.ausgesondert,
            version: this.version,
            kategorie: this.kategorie,
            preis: this.preis,
            
        };
    }

    _resetKategorie(): void { this.kategorie = []; }

    _addKategorie(kategorie: string): void {
        if (isBlank(this.kategorie)) {
            this.kategorie = [];
        }
        this.kategorie.push(kategorie);
    }
}
