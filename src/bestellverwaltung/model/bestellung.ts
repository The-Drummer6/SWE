import {isBlank, isPresent} from '../../util/util';
import Bestellposition from './bestellposition';

export interface IBestellungCommon {
    id?: string;
    bestellpositionen: Array<Bestellposition>;
    gesamtbetrag: number;
    kundeuri: string;
    datum: string;
    version: number;
}


export default class Bestellung {

    constructor(
        public id: string, public bestellpositionen: Array<Bestellposition>, public gesamtbetrag: number,
        public version: number, public datum: string, public kundeuri: string) {
        this.id = id || null;
        this.gesamtbetrag = gesamtbetrag || null;
        this.version = version || null;
        this.kundeuri = kundeuri || null;
        this.datum = datum || null;
        this.bestellpositionen =
            isPresent(bestellpositionen) && bestellpositionen.length !== 0 ?
                bestellpositionen :
                [];
    }
}      