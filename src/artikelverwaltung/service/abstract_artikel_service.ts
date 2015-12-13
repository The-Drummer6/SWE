import {Response} from 'angular2/http';

import Artikel from '../model/artikel';
import {IArtikelForm} from '../model/artikel';

abstract class AbstractArtikelService {
    abstract find(
        suchkriterien: IArtikelForm,
        successHandler: (artikel: Array<Artikel>) => void,
        errorHandler: (response: Response) => void): void;

    abstract findById(id: string, errorHTTP: (response: Response) => void):
        void;

    abstract save(
        neuerArtikel: Artikel, successHTTP: () => void,
        errorHTTP: (response: Response) => void): void;

    abstract update(
        artikel: Artikel, successHTTP: () => void,
        errorHTTP: (response: Response) => void): void;

    abstract remove(
        artikel: Artikel, successHTTP: () => void,
        errorHTTP: (response: Response) => void): void;

    abstract setBarChart(elementIdChart: string): void;

    abstract setLinearChart(elementIdChart: string): void;

    abstract setPieChart(elementIdChart: string): void;
}

export default AbstractArtikelService;