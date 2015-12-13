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
    OnInit
} from 'angular2/angular2';
import {Router} from 'angular2/router';

import BuecherService from '../../service/buecher_service';
import Buch from '../../model/buch';
import {isBlank, log} from '../../../util/util';

@Component({
    selector: 'schlagwoerter',
    template: `
        <!-- Abstand nach oben zu den Tabs -->
        <p>&nbsp;</p>

        <form [ng-form-model]="form" (submit)="update()"
              class="form-horizontal" role="form">
            <div class="form-group">
                <label for="schlagwoerterInput" class="col-sm-2 control-label">
                    Schlagw&ouml;rter
                </label>
                <div class="col-sm-10">
                    <div class="checkbox">
                        <label>
                            <input type="checkbox" [ng-form-control]="schnulze">
                            Schnulze
                        </label>
                    </div>
                    <div class="checkbox">
                        <label>
                            <input type="checkbox"[ng-form-control]="scienceFiction">
                            Science Fiction
                        </label>
                    </div>
                </div>
            </div>

            <div class="form-group">
                <div class="col-sm-offset-2 col-sm-10">
                    <button class="btn btn-default"
                            [disabled]="form.pristine || !form.valid">
                        <i class="fa fa-check"></i> &nbsp; Schlagw&ouml;rter aktualisieren
                    </button>
                </div>
            </div>
        </form>
    `,
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES]
})
export default class Schlagwoerter implements OnInit {
    // <schlagwoerter [buch]="...">
    @Input() buch: Buch;

    form: ControlGroup;
    schnulze: Control;
    scienceFiction: Control;

    constructor(
        private _formBuilder: FormBuilder,
        private _buecherService: BuecherService, private _router: Router) {
        console.log('Schlagwoerter.constructor()');
    }

    onInit(): void {
        console.log('Schlagwoerter.onInit(): buch=', this.buch);

        // Definition und Vorbelegung der Eingabedaten (hier: Checkbox)
        const hasSchnulze: boolean = this.buch.hasSchlagwort('SCHNULZE');
        this.schnulze = new Control(hasSchnulze);
        const hasScienceFiction: boolean =
            this.buch.hasSchlagwort('SCIENCE_FICTION');
        this.scienceFiction = new Control(hasScienceFiction);

        this.form = this._formBuilder.group({
            // siehe ng-form-control innerhalb von @Component({template: `...`})
            'schnulze': this.schnulze,
            'scienceFiction': this.scienceFiction
        });
    }

    @log
    update(): boolean {
        if (this.form.pristine) {
            console.log('Schlagwoerter.update(): pristine');
            return;
        }

        if (isBlank(this.buch)) {
            console.error('Schlagwoerter.update(): buch === null/undefined');
            return;
        }

        this.buch.updateSchlagwoerter(
            this.schnulze.value, this.scienceFiction.value);
        console.log('Schlagwoerter.update(): buch=', this.buch);

        const success: () => void =
            (): void => { this._router.navigate(['/Home']); };
        this._buecherService.update(this.buch, success, null);

        // damit das (Submit-) Ereignis konsumiert wird und nicht an
        // übergeordnete
        // Eltern-Komponenten propagiert wird bis zum Refresh der gesamten Seite
        return false;
    }

    toString(): String { return 'Schlagwoerter'; }
}
