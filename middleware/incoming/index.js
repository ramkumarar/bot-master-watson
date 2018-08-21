/**
 * Copyright 2017 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 

const reply = require('./reply');
const weather = require('./weather');
const stock = require('./stock');
const fundinfo = require('./fundinfo');
const tone = require('./tone');
const railfareinfo = require('./railfareinfo');
const railseatinfo = require('./railseatinfo');
const railpnrstatus = require('./railpnrstatus');
const fxinfo = require('./fxinfo');
const bankproducts = require('./bankproducts');
const discovery = require('./discovery');


module.exports = {
  tone,
  weather,
  stock,
  fundinfo,
  railfareinfo,
  railseatinfo,
  railpnrstatus,
  fxinfo,
  bankproducts,
  discovery,
  reply
};
