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
    CORE_DIRECTIVES,
    FORM_DIRECTIVES,
    FormBuilder,
    Input,
    ControlGroup,
    Control,
    Validators,
    OnInit
} from 'angular2/angular2';
import {Router} from 'angular2/router';

import BuecherService from '../../service/buecher_service';
import Buch from '../../model/buch';
import BuchValidator from '../validator/buch_validator';
import {isBlank, log} from '../../../util/util';

@Component({
    selector: 'stammdaten',
    template: `
        <!-- Abstand nach oben zu den Tabs -->
        <p>&nbsp;</p>

        <form [ng-form-model]="form" (submit)="update()"
              class="form-horizontal" role="form">
            <div class="form-group"
                 [class.has-error]="!titel.valid && titel.touched">
                <label for="titelInput" class="col-sm-2 control-label">
                    Titel *
                </label>
                <div class="col-sm-10">
                    <input id="titelInput"
                        placeholder="Titel"
                        class="form-control"
                        autofocus
                        type="search"
                        [ng-form-control]="titel">
                </div>
                <div class="col-sm-offset-2 col-sm-10"
                     *ng-if="!titel.valid && titel.touched">
                    <span class="help-block">
                        Ein Buchtitel muss mit einem Buchstaben
                        oder einer Ziffer beginnen.
                    </span>
                </div>
            </div>

            <div class="form-group">
                <label class="col-sm-2 control-label">Art *</label>
                <div class="col-sm-10">
                    <select class="form-control" [ng-form-control]="art">
                        <option value="GEBUNDEN">gebunden</option>
                        <option value="BROSCHIERT">broschiert</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <label class="col-sm-2 control-label">Verlag</label>
                <div class="col-sm-10">
                    <select class="form-control" [ng-form-control]="verlag">
                        <option value="OREILLY">O'Reilly</option>
                        <option value="PACKT">Packt</option>
                    </select>
                </div>
            </div>

            <div class="form-group">
                <div class="col-sm-offset-2 col-sm-10">
                    <button class="btn btn-default"
                            [disabled]="form.pristine || !form.valid">
                        <i class="fa fa-check"></i> &nbsp; Stammdaten aktualisieren
                    </button>
                </div>
            </div>
        </form>
    `,
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES],
    // FormBuilder ist nur fuer die Komponente und ihre Kind-Komponenten
    // verfuegbar
    /* tslint:disable:max-line-length */
    // http://blog.thoughtram.io/angular/2015/08/20/host-and-visibility-in-angular-2-dependency-injection.html
    /* tslint:enable:max-line-length */
    providers: [FormBuilder]
})
export default class Stammdaten implements OnInit {
    // <stammdaten [buch]="...">
    @Input() buch: Buch;

    form: ControlGroup;
    titel: Control;
    art: Control;
    verlag: Control;

    constructor(
        private _formBuilder: FormBuilder,
        private _buecherService: BuecherService, private _router: Router) {
        console.log('Stammdaten.constructor()');
    }

    onInit(): void {
        console.log('Stammdaten.onInit(): buch=', this.buch);

        // Definition und Vorbelegung der Eingabedaten
        this.titel = new Control(this.buch.titel, BuchValidator.titel);
        this.art = new Control(this.buch.art, Validators.required);
        this.verlag = new Control(this.buch.verlag);

        this.form = this._formBuilder.group({
            // siehe ng-form-control innerhalb von @Component({template: `...`})
            'titel': this.titel,
            'art': this.art,
            'verlag': this.verlag
        });
    }

    @log
    update(): boolean {
        if (this.form.pristine) {
            console.log('Stammdaten.update(): pristine');
            return;
        }

        if (isBlank(this.buch)) {
            console.error('Stammdaten.update(): buch === null/undefined');
            return;
        }

        // rating, preis und rabatt koennen im Formular nicht geaendert werden
        this.buch.updateStammdaten(
            this.titel.value, this.buch.rating, this.art.value,
            this.verlag.value, this.buch.preis, this.buch.rabatt);
        console.log('Stammdaten.update(): buch=', this.buch);

        const success: () => void =
            (): void => { this._router.navigate(['/Home']); };
        this._buecherService.update(this.buch, success, null);

        // damit das (Submit-) Ereignis konsumiert wird und nicht an
        // uebergeordnete Eltern-Komponenten propagiert wird bis zum
        // Refresh der gesamten Seite
        return false;
    }

    toString(): String { return 'Stammdaten'; }
}
