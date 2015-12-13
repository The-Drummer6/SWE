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

import {
    Component,
    FORM_DIRECTIVES,
    CORE_DIRECTIVES,
    FormBuilder,
    ControlGroup,
    Control,
    Validators,
    OnInit
} from 'angular2/angular2';
import {Response} from 'angular2/http';
import {Router, CanActivate} from 'angular2/router';

import BuecherService from '../../service/artikel_service';
import Buch from '../../model/artikel';
import BuchValidator from '../validator/artikel_validator';
import {isAdmin} from '../../../iam/iam_service';
import {log} from '../../../util/util';

// Importieren des HTML-Templates als String.
// Bei @Component({templateUrl: ...}) muesste man eine URI angeben
// https://github.com/systemjs/plugin-text
import template from './create_artikel.html';


@Component({
    selector: 'create-artikel',
    // Keine Zerlegung in Subkomponenten, weil das Control-Objekt der
    // Subkomponente im Konstruktor fuer die ControlGroup benoetigt wird
    template: template,
    // Verwendung der Direktiven ng-form-model und ng-form-control
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES],
    // FormBuilder ist nur fuer die Komponente und ihre Kind-Komponenten
    // verfuegbar
    /* tslint:disable:max-line-length */
    // http://blog.thoughtram.io/angular/2015/08/20/host-and-visibility-in-angular-2-dependency-injection.html
    /* tslint:enable:max-line-length */
    providers: [FormBuilder]
})
// Die Komponente kann nur aktiviert bzw. benutzt werden, wenn die aufgerufene
// Function
// true liefert
@CanActivate(() => isAdmin())
export default class CreateArtikel implements OnInit {
    form: ControlGroup;
    // Keine Vorbelegung bzw. der leere String, da es Placeholder gibt
    titel: Control = new Control('', BuchValidator.titel);
    art: string = 'GEBUNDEN';
    // Varianten fuer Validierung:
    //    serverseitig mittels Request/Response
    //    clientseitig bei den Ereignissen keyup, change, ...
    // Ein Endbenutzer bewirkt staendig einen neuen Fehlerstatus
    verlag: Control = new Control('', Validators.required);
    schnulze: Control = new Control(false);
    scienceFiction: Control = new Control(false);
    preis: Control = new Control('', Validators.required);
    rabatt: Control = new Control('', Validators.required);

    constructor(
        private _formBuilder: FormBuilder,
        private _buecherService: BuecherService, private _router: Router) {
        console.log('CreateBuch.constructor()');
    }

    onInit(): void {
        this.form = this._formBuilder.group({
            // siehe ng-form-control innerhalb von @Component({template: `...`})
            'titel': this.titel,
            'verlag': this.verlag,
            'schnulze': this.schnulze,
            'scienceFiction': this.scienceFiction,
            'preis': this.preis,
            'rabatt': this.rabatt
        });
    }

    @log
    save(): boolean {
        // In einem Control oder in einer ControlGroup gibt es u.a. folgende
        // Properties
        //    value     JSON-Objekt mit den IDs aus der ControlGroup als
        //              Schluessel und den zugehoerigen Werten
        //    errors    Map<string,any> mit den Fehlern, z.B. {'required': true}
        //    valid     true/false
        //    dirty     true/false, falls der Wert geaendert wurde

        if (!this.form.valid) {
            /* tslint:disable:max-line-length */
            console.log(
                `valid=${this.titel.valid}, errorRequired=${this.titel.errors['required']}`);
            /* tslint:enable:max-line-length */
            return false;
        }

        const neuesBuch: Buch = Buch.fromForm(this.form.value, {art: this.art});
        console.log('neuesBuch=', neuesBuch);

        const success: () => void =
            (): void => { this._router.navigate(['Home']); };
        const error: (response: Response) => void = (response: Response) => {
            console.log(`response.status: ${response.status}`);
            console.log(`response.text: ${response.text()}`);
        };

        this._buecherService.save(neuesBuch, success, error);

        // damit das (Submit-) Ereignis konsumiert wird und nicht an
        // uebergeordnete Eltern-Komponenten propagiert wird bis zum Refresh
        // der gesamten Seite
        return false;
    }

    toString(): String { return 'CreateBuch'; }
}
