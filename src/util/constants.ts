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

import {provide, Provider} from 'angular2/angular2';

const HTTPS: string = 'https';
const HTTP: string = 'http';
export const SCHEME: string = HTTPS;
export const HTTPS_PROVIDER: Provider = provide(SCHEME, {useValue: HTTPS});
export const HTTP_PROVIDER: Provider = provide(SCHEME, {useValue: HTTP});

const PORT_HTTPS: number = 8443;
const PORT_MOCK: number = 8444;
export const PORT: number = PORT_HTTPS;
export const PORT_PROVIDER: Provider = provide(PORT, {useValue: PORT_HTTPS});
export const PORT_MOCK_PROVIDER: Provider =
    provide(PORT, {useValue: PORT_MOCK});

export const SERVERNAME: string = 'localhost';
const BASE_PATH: string = '/shop/rest';
export const BASE_PATH_BUECHER: string = `${BASE_PATH}/buecher`;
