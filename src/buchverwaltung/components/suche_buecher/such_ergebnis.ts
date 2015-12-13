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
    CORE_DIRECTIVES,
    OnInit,
    Input,
    EventEmitter
} from 'angular2/angular2';
import {ROUTER_DIRECTIVES, Router} from 'angular2/router';
import {Response} from 'angular2/http';
import toastr from 'toastr/toastr';

import BuecherService from '../../service/buecher_service';
import Buch from '../../model/buch';
import {log} from '../../../util/util';

@Component({
    selector: 'such-ergebnis',
    template: `
        <!-- Template Binding durch die Direktive ng-if -->
        <!-- Eine Direktive ist eine Komponente ohne View -->
        <div *ng-if="waitingStatus">Die Daten werden geladen. Bitte warten ...</div>

        <div class="panel panel-primary"
             *ng-if="!initStatus && !waitingStatus && buecherArray != null">
            <div class="panel-heading">
                <h3 class="panel-title">
                    Gefundene B&uuml;cher
                </h3>
            </div>
            <div class="panel-body">
                <table class="table table-striped table-hover table-responsive">
                    <thead>
                        <tr>
                            <th>Nr.</th>
                            <th>ID</th>
                            <th>Titel</th>
                            <th>Verlag</th>
                            <th>Schlagw&ouml;rter</th>
                            <th><span class="sr-only">
                                    Spalte f&uuml;r Details</span>
                            </th>
                            <th><span class="sr-only">
                                    Spalte f&uuml;r Entfernen</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <!-- Template Binding: ng-for -->
                        <tr *ng-for="#b of buecherArray; #i = index" (click)="details(b)">
                            <td>{{i + 1}}</td>
                            <td>{{b.id}}</td>
                            <td>{{b.titel}}</td>
                            <td>
                                <span [ng-switch]="b.verlag">
                                    <span *ng-switch-when="'OREILLY'">O'Reilly</span>
                                    <span *ng-switch-when="'PACKT'">Packt</span>
                                    <span *ng-switch-default>unbekannt</span>
                                </span>
                            </td>
                            <td>
                                <span *ng-for="#sw of b.schlagwoerter">
                                    <span [ng-switch]="sw">
                                        <span *ng-switch-when="'SCHNULZE'">
                                            Schnulze<br>
                                        </span>
                                        <span *ng-switch-when="'SCIENCE_FICTION'">
                                            Sc. Fiction
                                        </span>
                                    </span>
                                </span>
                            </td>
                            <td>
                                <!-- Pfad /detailsBuch/:id, @RouteConfig in app.ts -->
                                <a [router-link]="['DetailsBuch', {'id': b.id}]"
                                   (click)="buch = b" data-toggle="tooltip"
                                   title="Details anzeigen">
                                    <i class="fa fa-search"></i>
                                </a>
                            </td>
                            <td>
                                <a (click)="remove(b)" data-toggle="tooltip"
                                   title="Entfernen">
                                    <i class="fa fa-close"></i>
                                </a>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <!-- Ausgabe des JSON-Datensatzes im Webbrowser statt console.log(...) -->
                <!--
                <pre>{{buecherArray | json}}</pre>
                -->
            </div>
            <div class="panel-footer">
                Zur Anzeige der JSON-Datens&auml;tze in gefundene_buecher.ts
                den Kommentar beim Tag &lt;pre&gt; entfernen
            </div>
        </div>

        <div class="has-error" *ng-if="errorMsg !== null">
            <div class="help-block">
                {{errorMsg}}
            </div>
        </div>
    `,
    directives: [CORE_DIRECTIVES, ROUTER_DIRECTIVES]
})
export default class SuchErgebnis implements OnInit {
    initStatus: boolean = true;

    // Property Binding: <such-ergebnis [waiting]="..." ...>
    // siehe InputMetadata in
    // jspm_packages\npm\angular2...\ts\src\core\metadata\directives.ts
    @Input('waiting-emitter') waitingEmitter: EventEmitter<boolean>;
    waitingStatus: boolean = false;

    @Input('buecher-emitter') buecherEmitter: EventEmitter<Array<Buch>>;
    buecherArray: Array<Buch> = null;

    @Input('error-emitter') errorEmitter: EventEmitter<Response>;
    errorMsg: string = null;

    constructor(
        private _buecherService: BuecherService, private _router: Router) {
        console.log('SuchErgebnis.constructor()');
    }

    onInit(): void {
        // Observer fuer Warten
        this.waitingEmitter.forEach((value: boolean) => {
            this.initStatus = false;
            this.waitingStatus = value;
            console.log(`SuchErgebnis.waitingStatus: ${this.waitingStatus}`);
        });

        // Observer fuer eine erfolgreiche Suche
        this.buecherEmitter.forEach((values: Array<Buch>) => {
            this.waitingStatus = false;
            this.buecherArray = values;
            this.errorMsg = null;
            console.log(`SuchErgebnis.buecherArray: ${this.buecherArray}`);
        });

        // Observer fuer eine fehlgeschlagene Suche
        this.errorEmitter.forEach((errResponse: Response) => {
            this.waitingStatus = false;
            this.buecherArray = null;

            if (errResponse === null) {
                this.errorMsg = 'Ein Fehler ist aufgetreten.';
                return;
            }
            switch (errResponse.status) {
                case 404:
                    this.errorMsg = 'Keine Bücher gefunden.';
                    break;
                default:
                    this.errorMsg = 'Ein Fehler ist aufgetreten.';
                    break;
            }
            console.log(`SuchErgebnis.errorMsg: ${this.errorMsg}`);

            // https://github.com/CodeSeven/toastr
            toastr.options.closeButton = true;
            toastr.options.closeHtml =
                '<button><i class="fa fa-times"></i></button>';
            toastr.options.progressBar = true;
            toastr.error(this.errorMsg);
            return;
        });
    }

    set buch(buch: Buch) {
        console.log('SuchErgebnis.set buch()', buch);
        this._buecherService.buch = buch;
    }

    @log
    details(buch: Buch): void {
        this._router.navigate(['DetailsBuch', {id: buch.id}]);
    }

    @log
    remove(buch: Buch): void {
        const error: (response: Response) => void =
            (response: Response): void => {
                console.error('Fehler beim Loeschen: response=', response);
            };
        this._buecherService.remove(buch, null, error);
        this.buecherArray =
            this.buecherArray.filter((b: Buch) => b.id !== buch.id);
    }

    toString(): String { return 'SuchErgebnis'; }
}
