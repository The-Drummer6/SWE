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

 import {BUECHER_SERVICE_PROVIDER} from
 '../buchverwaltung/service/buecher_service';
// import {MOCK_SERVER_PROVIDER} from
// '../buchverwaltung/service/mock/buecher_service_mock_server';
//import {
//   MOCK_OBJECTS_PROVIDER
//} from '../buchverwaltung/service/mock/buecher_service_mock_objects';
import {ARTIKEL_SERVICE_PROVIDER} from 
 '../artikelverwaltung/service/artikel_service';

import {HTTP_PROVIDER, PORT_MOCK_PROVIDER} from '../util/util';
// import {HTTPS_PROVIDER} from '../util/util';
// import {PORT_PROVIDER} from '../util/util';

const APP_PROVIDERS: Array<any> = [
    BUECHER_SERVICE_PROVIDER,
    // MOCK_SERVER_PROVIDER,
    //MOCK_OBJECTS_PROVIDER,
    ARTIKEL_SERVICE_PROVIDER,

   // HTTPS_PROVIDER,
    HTTP_PROVIDER,

    // PORT_PROVIDER
    PORT_MOCK_PROVIDER
];

export default APP_PROVIDERS;
