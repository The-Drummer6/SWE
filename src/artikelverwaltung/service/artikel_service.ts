import {Inject, provide, Provider} from 'angular2/angular2';
import {Http, Headers, Response} from 'angular2/http';
import {ChartDataSet, LinearChartData, CircularChartData, IChart } from 'chart/Chart';

import Artikel from '../model/artikel';
import {IArtikelServer, IArtikelForm} from '../model/artikel';
import {ChartService, SCHEME, SERVERNAME, PORT, BASE_PATH_ARTIKEL, isPresent,
        log, isEmpty, isBlank } from '../../util/util';


export default class ArtikelService {

    private _baseUriArtikel: string;
    private _alleartikel: Array<Artikel> = [];
    private _artikel: Artikel = null;
    private _initFind: boolean = true;
    private _loadingFind: boolean = false;
    private username: string = 'admin';
    private password: string = 'p';
    private basicAuth: string = 'Basic ' + window.btoa(`${this.username}:${this.password}`);
    private artikelheader = new Headers();
    private artikeluri: string = 'https://localhost:8443/shop/rest/artikel';


    constructor( @Inject(ChartService) private _chartService: ChartService,
        @Inject(Http) private _http: Http, @Inject(SCHEME) scheme: string,
        @Inject(PORT) port: number) {
        this._baseUriArtikel = `${scheme}:${SERVERNAME}:${port}${BASE_PATH_ARTIKEL}`;
        console.log("ShopService.Konstruktoraufruf" + this._baseUriArtikel);
        this.artikelheader.append('Accept', 'application/json');
        this.artikelheader.append('Content-Type', 'application/json');
        this.artikelheader.append('Authorization', this.basicAuth);
    }

    get loadingFind(): boolean { return this._loadingFind; }
    get initFind(): boolean { return this._initFind; }

    get alleartikel(): Array<Artikel> { return this._alleartikel; }
    get artikel(): Artikel { return this._artikel; }
    
    getall() {
        this._loadingFind = true;
        this._initFind = false;
        return this._http.get('https://localhost:8443/shop/rest/katalog')
            .map((responseData) => {
                return responseData.json();
            })
            .map((tasks: Array<any>) => {
                let result: Array<Artikel> = [];
                if (tasks) {
                    tasks.forEach((task) => {
                        result.push(new Artikel(task.id, task.bezeichnung, task.kategorie, task.preis, task.ausgesondert, task.rating, task.version));
                    });
                }
                this._loadingFind = false;
                return result;
            });
    }


    findbyId(id: string) {
        return this._http.get("https://localhost:8443/shop/rest/katalog/" + id)
            .map((response) => {
                return response.json();
            })
            .map((artikel: any) => {
                return new Artikel(artikel.id, artikel.bezeichnung, artikel.kategorie, artikel.preis, artikel.ausgesondert, artikel.rating, artikel.version)
            })
            .subscribe(res => this._artikel = res);
    }


    save(neuerArtikel: Artikel, successHTTP: () => void, errorHTTP: (response: Response) => void):
        void {

        if (neuerArtikel != null) {
            this._http.post(this.artikeluri, neuerArtikel, {
                headers: this.artikelheader,
                body: neuerArtikel
            })
                .map(res => console.log(res))
                .subscribe(
                data => { if (data) { console.log(data) } },
                err => { if (err) { console.log("err" + err) } },
                () => console.log('POST Successful')
                );
        }
        successHTTP();
    }
    
    //@log
    update(changedartikel: Artikel, successHTTP: () => void, errorHTTP: (response: Response) => void):
        void {

        if (changedartikel != null) {
            this._http.put(this.artikeluri, changedartikel, {
                headers: this.artikelheader
            })
                .map(res => console.log(res))
                .subscribe(
                data => { if (data) { console.log(data) } },
                err => { if (err) { console.log("err" + err) } },
                () => console.log('PUT Successful')
                );
        }
        successHTTP();
    }
    
    /*
    //@log
    find(kriterien: IBuchungForm, errorHTTP: (response: Response) => void): void {
        this._loadingFind = true;
        this._initFind = false;
        this._buchungen = this._allebuchungen;
        const {titel, kategorie, einzahlung, auszahlung}: any = kriterien;
        if (!isEmpty(titel)) {
            this._buchungen = this._buchungen.filter((buchung: Buchung) => buchung.containsTitel(titel));
        }
        if (!isEmpty(kategorie)) {
            this._buchungen = this._buchungen.filter((buchung: Buchung) => buchung.isKategorie(kategorie));
        }
        if (!isEmpty(einzahlung) && !isEmpty(auszahlung)) {           
        }
        else if (!isEmpty(einzahlung)) {
            this._buchungen =
                this._buchungen.filter((buchung: Buchung) => buchung.einzahlung == true);
        }
        else if (!isEmpty(auszahlung)) {
            this._buchungen =
                this._buchungen.filter((buchung: Buchung) => buchung.auszahlung == true);
        }
        this._loadingFind = false;
        console.log('Filter nach Buechern Ergebnis: ', this._buchungen);
    }
    
    @log
    findById(id: string, errorHTTP: (response: Response) => void) : void {
        this._buchung = null;
        for (var i = 0; i<this._allebuchungen.length; i++) {
            var idstring : string = this._allebuchungen[i].id.toString();
            if (id == idstring) {
                this._buchung = this._allebuchungen[i];
            }
        }
    }
    
    save(neueBuchung: Buchung, successHTTP: () => void, errorHTTP: (response: Response) => void):
        void {
            if (neueBuchung != null) {
                neueBuchung.id = nextId(this._allebuchungen[this._allebuchungen.length-1].id)
                this._allebuchungen.push(neueBuchung);
            }
            this._buchungen = this._allebuchungen;
            successHTTP();
    }
    
    @log
    delete(buchung: Buchung, successHTTP: () => void, errorHTTP: (response: Response) => void): void {
        this._allebuchungen = this._allebuchungen.filter((b: Buchung) => b.id !== buchung.id);
        this._buchungen = this._allebuchungen;
    }
 
    get buchung() : Buchung { return this._buchung;}
    */
}

export const MOCK_OBJECTS_PROVIDER: Provider =
    provide(ArtikelService, { useClass: ArtikelService });