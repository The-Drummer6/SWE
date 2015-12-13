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

import {Component} from 'angular2/angular2';
// RouterOutlet: Directive fuer das resultierende HTML-Template beim Routing,
// d.h. beim Tag <router-outlet>
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
    selector: 'app-main',
    template: `
        <!-- Komponente fuer das Routing, d.h. Platzhalter fuer den -->
        <!-- Austausch der HTML-Templates (= Fragmente) -->
        <!-- FIXME router-outlet wird zu router-viewport, -->
        <!--       RouterOutlet zu RouterViewport -->
        <!--       https://github.com/angular/angular/issues/4679 -->
        <!-- viewport: framed area on a display screen for viewing information -->
        <router-outlet></router-outlet>
    `,
    directives: [ROUTER_DIRECTIVES]
})
export default class Main {
    constructor() { console.log('Main.constructor()'); }

    toString(): String { return 'Main'; }
}
