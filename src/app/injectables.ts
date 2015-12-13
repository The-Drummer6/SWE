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

import IamService from '../iam/iam_service';
import {ChartService} from '../util/util';
import BuecherService from '../buchverwaltung/service/buecher_service';
/* tslint:disable:max-line-length */
import BuecherServiceMockServer from '../buchverwaltung/service/mock/buecher_service_mock_server';
import BuecherServiceMockObjects from '../buchverwaltung/service/mock/buecher_service_mock_objects';
/* tslint:enable:max-line-length */

const APP_INJECTABLES: Array<any> = [
    // Eigene Service-Klassen
    IamService,
    ChartService,

    BuecherService,
    BuecherServiceMockServer,
    BuecherServiceMockObjects,
];

export default APP_INJECTABLES;
