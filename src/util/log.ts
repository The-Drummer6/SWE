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

// In Anlehnung an:
// http://html5hive.org/getting-started-with-angular-2#crayon-560cd5f774dd7156114609
export function log(
    target: any /* Function */, key: string, descriptor: any): MethodDecorator {
    'use strict';
    const originalMethod: any = descriptor.value;

    // keine Arrow Function wg. this im Funktionsrumpf
    descriptor.value = function(...args: any[]): any {
        const klasseToString: string = target.toString();
        // indexOf: Zaehlung ab 0. -1 bedeutet nicht enthalten
        // bei Klassen mit toString() werden ggf. Attributwerte nach einem ":""
        // ausgegeben
        const positionColon: number = klasseToString.indexOf(':');
        const klassenname: string =
            positionColon === -1 ? klasseToString :
                                   klasseToString.substring(0, positionColon);
        console.log(`> ${klassenname}.${key}(): args=`, args);
        const result: any = originalMethod.apply(this, args);
        console.log(`< ${klassenname}.${key}(): result=`, result);

        return result;
    };
    return descriptor;
}

export default log;
