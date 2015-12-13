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

import {IBuchServer} from '../../model/buch';

const BUECHER: Array<IBuchServer> = [
    {
      id: '00000001-0000-0000-0000-000000000001',
      titel: 'Alpha',
      rating: 4,
      art: 'GEBUNDEN',
      verlag: 'OREILLY',
      schlagwoerter: ['SCHNULZE'],
      preis: 11.1,
      rabatt: 0.011,
      datum: '2014-02-01'
    },
    {
      id: '00000001-0000-0000-0000-000000000002',
      titel: 'Beta',
      rating: 2,
      art: 'BROSCHIERT',
      verlag: 'PACKT',
      schlagwoerter: ['SCIENCE_FICTION'],
      preis: 22.2,
      rabatt: 0.022,
      datum: '2014-02-02'
    },
    {
      id: '00000001-0000-0000-0000-000000000003',
      titel: 'Gamma',
      rating: 1,
      art: 'GEBUNDEN',
      verlag: 'PACKT',
      schlagwoerter: ['SCHNULZE', 'SCIENCE_FICTION'],
      preis: 33.3,
      rabatt: 0.033,
      datum: '2014-02-03'
    },
    {
      id: '00000001-0000-0000-0000-000000000004',
      titel: 'Delta',
      rating: 3,
      art: 'BROSCHIERT',
      verlag: 'OREILLY',
      schlagwoerter: [],
      preis: 44.4,
      rabatt: 0.044,
      datum: '2014-02-04'
    },
    {
      id: '00000001-0000-0000-0000-000000000005',
      titel: 'Epsilon',
      rating: 2,
      art: 'BROSCHIERT',
      verlag: 'PACKT',
      schlagwoerter: ['SCIENCE_FICTION'],
      preis: 55.5,
      rabatt: 0.055,
      datum: '2014-02-05'
    }
];

export default BUECHER;
