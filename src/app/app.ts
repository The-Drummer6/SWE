// In tsconfig.json *wird* man aehnlich wie bei SystemJS konfigurieren koennen,
// wo nicht-relative Pfade wie z.B. angular2/angular2 zu suchen sind.
// Derzeit sucht TypeScript nur in node_modules.
// https://github.com/Microsoft/TypeScript/issues/5039
// https://github.com/DefinitelyTyped/DefinitelyTyped

// AngularJS unterstuetzt npm als Package Manager. Deshalb werden .d.ts-Dateien
// im Verzeichnis node_modules bereitgestellt.
// https://github.com/angular/angular/issues/5248#issuecomment-156886060

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

// in config.js:
//      paths: {
//          "npm:*": "jspm_packages/npm/*"
//      map: {
//          "angular2": "npm:angular2@2.0.0-..."
// -> jspm_packages/npm/angular2@2.0.0-.../angular2.js
import {Component} from 'angular2/angular2';

// RouteConfig: Annotation fuer die Konfiguration des Routings
import {RouteConfig} from 'angular2/router';

import Header from './header';
import Nav from './nav';
import Main from './main';
import Footer from './footer';
import APP_ROUTES from './routes';

// Eine Komponente in AngularJS fasst gemaess MVC den Controller und die View
// zusammen und kann aus (Teil-) Komponenten zusammengesetzt sein.
// Controller sind klein ("Thin Controllers") und die Anwendungslogik wird
// in die Service-Klassen ausgelagert.
// https://angular.io/docs/js/latest/api/annotations/ComponentAnnotation-class.html

// Metadaten-Annotationen in AngularJS sind z.B. @Component.
// Annotationen sind ein Spezialfall der Decorators, die es ab ES 7 geben wird:
// Ein Decorator erweitert die vorhandene Funktionalitaet.
// siehe https://github.com/wycats/javascript-decorators

// Generierter Code einschl. IIFE durch einen Transpiler z.B.:
// var App = (function() {
//     function App() {/* Konstruktor */}
//     ...
//     App = __decorate([
//         angular2_1.Component({
//             selector: 'app',
//             template: "...",
//             directives: [...]
//         }),
//         __metadata('design:paramtypes', [])
//     ], App);
//     return App;
// })();
@Component({
    // Schnittstelle der View fuer Wiederverwendung in anderen Komponenten:
    // durch das Tag <app> in index.html
    // Schreibweise innerhalb von HTML:         kebab-case
    // Schreibweise innerhalb von TypeScript:   CamelCase
    // Beispiel:
    //   <app>
    //       <header>
    //           <app-header>
    //               ...
    //           </app-header>
    //       </header>
    //       <nav>
    //           <app-nav>
    //               ...
    //           </app-nav>
    //       </nav>
    //       <main>
    //           <router-viewport>
    //               <suche-buecher>
    //                   <such-kriterien>
    //                       ...
    //                   </such-kriterien>
    //                   <gefundene-buecher>
    //                       ...
    //                   </gefundene-buecher>
    //               </suche-buecher>
    //           <router-viewport>
    //       </main>
    //       <footer>
    //           <app-footer>
    //               ...
    //           </app-footer>
    //       </footer>
    //   </app>
    selector: 'app',

    // HTML-Templates ~ View bei MVC: das Model referenzieren u. den Controller
    // aufrufen. Multi-line Strings fuer Inline-Templates, damit der HTML-Code
    // auch klein bleibt.
    // Vorteile:  alles auf einen Blick und keine separate HTML-Datei
    // Nachteile: kein Syntax-Highlighting, kein Autovervollstaendigen
    // ABER: Es gibt eine Kooperation mit dem Microsoft-Team fuer VS Code fuer
    // Syntax-Highlighting und IntelliSense.
    // https://github.com/angular/angular/blob/master/CHANGELOG.md#features-4
    //
    // Composed DOM: Der Baum und die Tags, die im Browser dargestellt werden
    // Light DOM:    Der Baum, in den der Shadow-DOM eingefuegt wird,
    //               z.B. <suchel>
    // Shadow DOM:   Der Baum, der innerhalb des Light DOM eingefuegt wird,
    //               z.B. das Template aus SucheTitel.
    //               Dieser Baum ist zunaechst vor dem Endbenutzer verborgen
    // http://webcomponents.org/polyfills/shadow-dom
    // http://w3c.github.io/webcomponents/spec/shadow
    // https://github.com/angular/angular/issues/2529
    template: `
        <div class="row">
            <!-- Bootstrap 4:
                    xs:      -  480px ("extra small")
                    sm:      -  767px ("small")
                    md:  768 -  991px ("medium")
                    lg:  992 - 1199px ("large")
                    xl: 1200 px       ("extra large")
                 Bootstrap 3: Kategorie bis 480px gibt es nicht;
                              xs - lg ist um 1 Kategorie nach oben verschoben;
                              xl gibt es noch nicht
            -->
            <header class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <!-- Eigene Komponente fuer die Kopfleiste -->
                <app-header></app-header>
            </header>
        </div>
        <div class="row">
            <nav class="col-xs-12 col-sm-4 col-md-3 col-lg-3">
                <!-- Eigene Komponente fuer die Navigationsleiste -->
                <app-nav></app-nav>
            </nav>
            <main class="col-xs-12 col-sm-8 col-md-9 col-lg-9">
                <!-- Eigene Komponente fuer den Haupteil:
                     austauschbar durch Routing -->
                <app-main></app-main>
            </main>
        </div>
        <div class="row">
            <footer class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
                <!-- Eigene Komponente fuer die Fussleiste -->
                <app-footer></app-footer>
            </footer>
        </div>
    `,
    // Verwendete Komponenten innerhalb der View
    // Komponenten sind Direktiven mit einer eigenen View
    directives: [Header, Nav, Main, Footer]
})

// http://stackoverflow.com/questions/33401442/angular-2-0-difference-view-component
// @View({
//     media: 'Desktop',
//     template: 'Template for desktop'
// })
// @View({
//     media: 'Mobile',
//     template: 'Template for Mobile'
// })

// Konfiguration des Routings fuer die Komponente "App": Bookmarks, Refresh der
// aktuellen Seite
@RouteConfig(APP_ROUTES)

// Definitionsklasse ~ Controller: Eingabedaten entgegennehmen, Model fuer die
// View aktualisieren, Funktionen fuer die Benutzer-Interaktion bereitstellen,
// z.B. onClick oder onSubmit
export default class App {
    constructor() { console.log('App.constructor()'); }

    toString(): string { return 'App'; }
}
