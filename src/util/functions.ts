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

// siehe ts\src\core\facade\lang.ts

export function isPresent(obj: any): boolean {
    'use strict';
    return obj !== undefined && obj !== null;
}

export function isBlank(obj: any): boolean {
    'use strict';
    return obj === undefined || obj === null;
}

export function isEmpty(obj: string): boolean {
    'use strict';
    return obj === undefined || obj === null || obj === '';
}

// In AngularJS durch Pipes wie z.B. currency oder percent
// export function toEuro(value: number): string {
//     'use strict';
//     const options: any = {
//         minimumIntegerDigits: 1,
//         minimumFractionDigits: 2,
//         maximumFractionDigits: 2,
//         style: 'currency',
//         currency: 'eur',
//         currencyDisplay: 'symbol'
//     };
//     return new Intl.NumberFormat('de', options).format(value);
// }
//
// export function toProzent(value: number): string {
//     'use strict';
//     const options: any = {
//         minimumIntegerDigits: 1,
//         minimumFractionDigits: 1,
//         maximumFractionDigits: 2,
//         style: 'percent'
//     };
//     return new Intl.NumberFormat('de', options).format(value);
// }
