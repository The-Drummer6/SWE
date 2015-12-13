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

// 2 Deprecations https://github.com/angular/zone.js/issues/153
import 'zone.js';
// Decorators (Proposal fuer Metadaten in ES7) emulieren
import 'reflect-metadata';

// z.B. Array.from() aus ES 2015 fuer aeltere Browser mit ES 5 emulieren
// import 'es6-shim';

import {bootstrap, provide} from 'angular2/angular2';
import {
    ROUTER_PROVIDERS,
    ROUTER_PRIMARY_COMPONENT,
    APP_BASE_HREF
} from 'angular2/router';
// import {LocationStrategy, HashLocationStrategy} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import App from './app';
import APP_INJECTABLES from './injectables';
import APP_PROVIDERS from './providers';

bootstrap(
    App,
    [
      // Eigene Service-Objekte innerhalb der Root-Komponente sind Singletons
      // durch den "application-wide injector"
      // https://angular.io/docs/ts/latest/guide/hierarchical-dependency-injection.html
      APP_INJECTABLES,
      APP_PROVIDERS,

      // FIXME ROUTER_PROVIDERS wird evtl. umbenannt in ROUTER
      // https://github.com/angular/angular/issues/4834
      ROUTER_PROVIDERS,
      provide(ROUTER_PRIMARY_COMPONENT, {useValue: App}),
      provide(APP_BASE_HREF, {useValue: '/'}),

      /* tslint:disable:max-line-length */
      // PathLocationStrategy ist der Default fuer LocationStrategy,
      // d.h. normale Pfade als Routen ("HTML5 routing").
      // AngularJS 1: HashLocationStrategy
      //
      // Bookmarks und Page Refresh bei PathLocationStrategy:
      //      browser-sync:
      //      http://stackoverflow.com/questions/24474914/can-i-tell-browser-sync-to-always-use-one-html-file-for-html5mode-links#answer-30711530
      //      http-server: HashLocationStrategy wg. Refresh verwenden
      //      Apache Webserver:
      //      http://stackoverflow.com/questions/14319967/angularjs-routing-without-the-hash#answer-21484874
      //      nginx:   http://wiki.nginx.org/HttpRewriteModule#rewrite
      //               http://winginx.com/htaccess
      //               http://www.anilcetin.com/convert-apache-htaccess-to-nginx
      // provide(LocationStrategy, {useClass: HashLocationStrategy}),
      /* tslint:enable:max-line-length */

      // FIXME HTTP_PROVIDERS wird evtl. umbenannt in HTTP
      // https://github.com/angular/angular/issues/4834
      HTTP_PROVIDERS
    ])
    .then((success: any) => console.log(success))
    .catch((error: any) => console.error(error));
