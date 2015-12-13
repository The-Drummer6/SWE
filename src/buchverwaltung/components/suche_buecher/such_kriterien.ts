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
    FORM_DIRECTIVES,
    CORE_DIRECTIVES,
    FormBuilder,
    ControlGroup,
    Control,
    OnInit,
    Input,
    EventEmitter
} from 'angular2/angular2';
import {Response} from 'angular2/http';

import BuecherService from '../../service/buecher_service';
import Buch from '../../model/buch';
import {log} from '../../../util/util';

@Component({
    selector: 'such-kriterien',
    template: `
        <p></p>
        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Eingabe der Suchkriterien</h3>
            </div>
            <div class="panel-body">
                <!-- Formulare zur Interaktion mit dem Endbenutzer:
                        * Daten werden modifiziert, z.B. in Suchfelder
                          oder Erfassungs-/Aenderungsformularen
                        * Aenderungen wirken sich auf Teile der Seite aus:
                          Ergebnisse/Fehler anzeigen, Navigationsmoeglichkeiten
                        * Eingaben werden validiert
                -->
                <!-- Template-Syntax:
                     (submit)="find()"   fuer Output = Event Binding
                                         d.h. Ereignis submit an find() anbinden
                     [ng-form-model]="form"   fuer Input = Property Binding
                                              d.h. ng-form-model fuer Attr. form
                     #localVar   fuer eine lokale Variable
                                 z.B. bei *ng-for in gefundene_buecher.ts
                     Definition von Attributnamen gemaess HTML: Attribute names
                     must consist of one or more characters other than the
                     space characters, U+0000 NULL, """, "'", ">", "/", "=",
                     the control characters, and any characters that are not
                     defined by Unicode.
                -->
                <!-- CSS-Klassen von Bootstrap:
                     form-horizontal, form-group, control-label, btn, ...
                -->
                <form [ng-form-model]="form" (submit)="find()"
                      class="form-horizontal" role="form">

                    <div class="form-group">
                        <label for="titelInput"
                               class="col-sm-2 control-label">Titel</label>
                        <div class="col-sm-10">
                            <input id="titelInput"
                                type="search"
                                placeholder="Den Titel oder einen Teil davon eingeben"
                                class="form-control"
                                [ng-form-control]="titel">
                            <!-- Control ohne zusaetzl. Validierung:
                                 <input #titel>
                            -->
                        </div>
                    </div>

                    <div class="form-group">
                        <label class="col-sm-2 control-label">Verlag</label>
                        <div class="col-sm-10">
                            <select class="form-control"
                                    [ng-form-control]="verlag">
                                <option value=""></option>
                                <option value="OREILLY">O'Reilly</option>
                                <option value="PACKT">Packt</option>
                        </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="schlagwoerterInput"
                               class="col-sm-2 control-label">
                            Schlagw&ouml;rter
                        </label>
                        <div class="col-sm-10">
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox"
                                           [ng-form-control]="schnulze">
                                    Schnulze
                                <label>
                            </div>
                            <div class="checkbox">
                                <label>
                                    <input type="checkbox"
                                           [ng-form-control]="scienceFiction">
                                    Science Fiction
                                <label>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-10">
                            <div class="help-block">
                                Hinweis: Keine Eingabe liefert alle B&uuml;cher
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <div class="col-sm-offset-2 col-sm-10">
                            <button class="btn btn-default"><i class="fa fa-search"></i>
                            &nbsp; Suchen</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    `,
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES],
    /* tslint:disable:max-line-length */
    // FormBuilder nur fuer diese Komponente und ihre Kind-Komponenten notwendig
    // http://blog.thoughtram.io/angular/2015/08/20/host-and-visibility-in-angular-2-dependency-injection.html
    /* tslint:enable:max-line-length */
    providers: [FormBuilder]
})
export default class SuchKriterien implements OnInit {
    form: ControlGroup;
    // Keine Vorbelegung bzw. der leere String: Attribut placeholder beim Tag
    // <input>. Keine Validierung des Suchfeldes
    titel: Control = new Control('');
    verlag: Control = new Control('');
    schnulze: Control = new Control('');
    scienceFiction: Control = new Control('');

    // Property Binding: <such-kriterien [waiting]="..." ...>
    // siehe InputMetadata in
    // jspm_packages\npm\angular2...\ts\src\core\metadata\directives.ts
    @Input('waiting-emitter') waitingEmitter: EventEmitter<boolean>;
    @Input('buecher-emitter') buecherEmitter: EventEmitter<Array<Buch>>;
    @Input('error-emitter') errorEmitter: EventEmitter<Response>;

    // Empfehlung: Konstruktor nur fuer DI
    constructor(
        private _formBuilder: FormBuilder,
        private _buecherService: BuecherService) {
        console.log('SuchKriterien.constructor()');
    }

    // Methode zum "LifeCycle Hook" OnInit: wird direkt nach dem Konstruktor
    // aufgerufen. Entspricht @PostConstruct bei Java EE
    // jspm_packages\npm\angular2...\ts\src\core\linker\interfaces.ts
    // Die Methode onInit wird umbenannt in ngOnInit
    // https://github.com/angular/angular/issues/5036
    onInit(): void {
        this.form = this._formBuilder.group({
            // siehe ng-form-control innerhalb von @Component({template: `...`})
            'titel': this.titel,
            'verlag': this.verlag,
            'schnulze': this.schnulze,
            'scienceFiction': this.scienceFiction
        });
    }

    @log
    find(): boolean {
        console.log('form.value=', this.form.value);

        this.waitingEmitter.next(true);

        // fuer den asynchronen Callback zu subscribe() fuer das Observable vom
        // GET-Request
        const successHandler: (buecherArray: Array<Buch>) => void =
            (buecherArray: Array<Buch>) => { this.buecherEmitter.next(buecherArray); };
        const errorHandler: (response: Response) => void =
            (response: Response) => {
                if (response !== null) {
                    console.log(
                        `SuchKriterien response.status: ${response.status}`);
                }
                // FIXME AngularJS 2.0.0-alpha.47: next() wird zu emit()
                // https://github.com/angular/angular/issues/4287
                this.errorEmitter.next(response);
            };

        this._buecherService.find(
            this.form.value, successHandler, errorHandler);

        // damit das (Submit-) Ereignis konsumiert wird und nicht an
        // uebergeordnete Eltern-Komponenten propagiert wird bis zum
        // Refresh der gesamten Seite.
        return false;
    }

    toString(): String { return 'SuchKriterien'; }
}
