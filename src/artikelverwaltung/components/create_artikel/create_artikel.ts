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

import ArtikelService from '../service/artikel_service';
import Artikel from '../model/artikel';
import ArtikelValidator from '../validator/artikel_validator';
import {isAdmin} from '../../iam/iam_service';
import {log} from '../../util/util';

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
    bezeichnung: Control = new Control('', ArtikelValidator.bezeichnung);
    //art: string = 'GEBUNDEN';
    // Varianten fuer Validierung:
    //    serverseitig mittels Request/Response
    //    clientseitig bei den Ereignissen keyup, change, ...
    // Ein Endbenutzer bewirkt staendig einen neuen Fehlerstatus
    preis: Control = new Control('', Validators.required);
    version: Control = new Control('', Validators.required);
    bad: Control = new Control(false);
    buero: Control = new Control(false);
    diele: Control = new Control(false);
    esszimmer: Control = new Control(false);
    kinderzimmer: Control = new Control(false);
    kueche: Control = new Control(false);
    schlafzimmer: Control = new Control(false);
    wohnzimmer: Control = new Control(false);
   

    constructor(
        private _formBuilder: FormBuilder,
        private _artikelService: ArtikelService, private _router: Router) {
        console.log('CreateArtikel.constructor()');
    }
    onInit(): void {
        this.form = this._formBuilder.group({
            // siehe ng-form-control innerhalb von @Component({template: `...`})
            'bezeichnung': this.bezeichnung,
            'preis': this.preis,
            'version': this.version,
            'bad': this.bad,
            'buero': this.buero,
            'diele': this.diele,
            'esszimmer': this.esszimmer,
            'kinderzimmer': this.kinderzimmer,
            'kueche': this.kueche,
            'schlafzimmer': this.schlafzimmer,
            'wohnzimmer': this.wohnzimmer
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
                `valid=${this.bezeichnung.valid}, errorRequired=${this.bezeichnung.errors['required']}`);
            /* tslint:enable:max-line-length */
            return false;
        }

        const neuerArtikel: Artikel = Artikel.fromForm(this.form.value);
        console.log('neuerArtikel=', neuerArtikel);

        const success: () => void =
            (): void => { this._router.navigate(['Home']); };
        const error: (response: Response) => void = (response: Response) => {
            console.log(`response.status: ${response.status}`);
            console.log(`response.text: ${response.text()}`);
        };

        this._artikelService.save(neuerArtikel, success, error);

        // damit das (Submit-) Ereignis konsumiert wird und nicht an
        // uebergeordnete Eltern-Komponenten propagiert wird bis zum Refresh
        // der gesamten Seite
        return false;
    }

    toString(): String { return 'CreateArtikel'; }
}
