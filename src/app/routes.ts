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

import {RouteDefinition} from 'angular2/router';

import Home from './home';
import SucheBuecher from '../buchverwaltung/components/suche_buecher/suche_buecher';
import DetailsBuch from '../buchverwaltung/components/details_buch/details_buch';
import CreateBuch from '../buchverwaltung/components/create_buch/create_buch';
import CreateArtikel from '../artikelverwaltung/components/create_artikel/create_artikel';
import UpdateBuch from '../buchverwaltung/components/update_buch/update_buch';
/* tslint:disable:max-line-length */
import BalkendiagrammBewertungen from '../buchverwaltung/components/balkendiagramm_bewertungen/balkendiagramm_bewertungen';
import LiniendiagrammBewertungen from '../buchverwaltung/components/liniendiagramm_bewertungen/liniendiagramm_bewertungen';
import TortendiagrammBewertungen from '../buchverwaltung/components/tortendiagramm_bewertungen/tortendiagramm_bewertungen';
/* tslint:enable:max-line-length */

const APP_ROUTES: Array<RouteDefinition> = [
    // FIXME AngularJS 2.0.0-beta: "as" wird umbenannt in "name"
    // https://github.com/angular/angular/issues/4622
    {path: '/home', as: 'Home', component: Home},
    // {path: '/', as: 'Home', component: Home},
    {path: '/sucheBuecher', as: 'SucheBuecher', component: SucheBuecher},
    // z.B. Pfad .../detailsBuch/0000...0815
    {path: '/detailsBuch/:id', as: 'DetailsBuch', component: DetailsBuch},
    {path: '/updateBuch/:id', as: 'UpdateBuch', component: UpdateBuch},
    {path: '/createBuch', as: 'CreateBuch', component: CreateBuch},
    {path: '/createArtikel', as: 'CreateArikel', component: CreateArtikel},
    {
      path: '/balkendiagramm',
      as: 'Balkendiagramm',
      component: BalkendiagrammBewertungen
    },
    
    {
      path: '/liniendiagramm',
      as: 'Liniendiagramm',
      component: LiniendiagrammBewertungen
    },
    {
      path: '/tortendiagramm',
      as: 'Tortendiagramm',
      component: TortendiagrammBewertungen
    },
    // {path: '/', redirectTo: ['Home']}
    {path: '/', redirectTo: '/home'}
];

export default APP_ROUTES;
