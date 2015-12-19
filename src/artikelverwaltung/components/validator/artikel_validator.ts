import {Control} from 'angular2/angular2';
import {isBlank} from '../../../util/util';

export default class ArtikelValidator {

    static bezeichnung(control: Control): {[key: string]: boolean} {

        const invalid: boolean =
            isBlank(control.value) || control.value.match(/^\w.*/) === null;
        return invalid ? {invalidTitel: true} : null;
    }
}