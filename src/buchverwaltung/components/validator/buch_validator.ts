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

import {Control} from 'angular2/angular2';
import {isBlank} from '../../../util/util';

export default class BuchValidator {
    // Rueckgabewert null bedeutet valid
    static titel(control: Control): {[key: string]: boolean} {
        // Ein Titel muss existieren und das 1. Zeichen muss ein Buchstabe,
        // Ziffer oder _ sein
        const invalid: boolean =
            isBlank(control.value) || control.value.match(/^\w.*/) === null;
        return invalid ? {invalidTitel: true} : null;
    }
}
