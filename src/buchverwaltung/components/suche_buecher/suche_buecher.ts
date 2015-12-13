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

// ng-class, ng-for, ng-if, ng-non-bindable, ng-switch, ng-switch-when,
// ng-switch-default
import {
    Component,
    EventEmitter,
    OnDestroy
} from 'angular2/angular2';  // externes Modul
import {Response} from 'angular2/http';

import SuchKriterien from './such_kriterien'; // internes Modul
import SuchErgebnis from './such_ergebnis';
import Buch from '../../model/buch';

@Component({
    selector: 'suche-buecher',
    template: `
        <such-kriterien [waiting-emitter]="waitingEmitter"
                        [buecher-emitter]="buecherEmitter"
                        [error-emitter]="errorEmitter"></such-kriterien>
        <such-ergebnis [waiting-emitter]="waitingEmitter"
                       [buecher-emitter]="buecherEmitter"
                       [error-emitter]="errorEmitter"></such-ergebnis>
    `,
    directives: [SuchKriterien, SuchErgebnis]
})
export default class SucheBuecher implements OnDestroy {
    // EventEmitter ist abgeleitet von Subject und hat zusaetzl. die Methode
    // subscribe().  Subject ist wiederum abgeleitet von Observable und hat
    // zusaetz. add(), remove(), unsubscribe(), next(), complete().
    // jspm_packages\npm\angular2@...\ts\src\src\facade\async.ts
    // jspm_packages\npm\@reactivex\rxjs@...\src\Subject.js

    waitingEmitter: EventEmitter<boolean> = new EventEmitter<boolean>();
    buecherEmitter: EventEmitter<Array<Buch>> = new EventEmitter<Array<Buch>>();
    errorEmitter: EventEmitter<Response> = new EventEmitter<Response>();

    constructor() { console.log('SucheBuecher.constructor()'); }

    // Methode zum "LifeCycle Hook" OnDestroy:
    // wird direkt vor dem Garbage Collector aufgerufen
    // jspm_packages\npm\angular2...\ts\src\core\linker\interfaces.ts
    // Die Methode onDestroy wird umbenannt in ngOnDestroy
    // https://github.com/angular/angular/issues/5036
    onDestroy(): void { console.log('SucheBuecher.onDestroy()'); }

    toString(): String { return 'SucheBuecher'; }
}
