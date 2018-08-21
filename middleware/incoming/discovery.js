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

const request = require('request-promise');
const DiscoveryV1 = require('watson-developer-cloud/discovery/v1');



const addDiscoveryInfoToUpdate = {
  type: 'incoming',
  name: 'add-discoveryinfo-to-update',
  controller: (bot, update, next) => {

    

    if (update.watsonUpdate.output.context  && update.watsonUpdate.output.context.action.name === 'lookupdiscoveryquery') {
        lookupdiscoveryquery(update,next)        
    } else {
        next();       
    }
  }
}

function lookupdiscoveryquery(update, next) {    
   let query = update.watsonUpdate.output.context.action.query ;   

   const discovery = new DiscoveryV1({
    version_date: '2017-02-03', 
    username: 'edba5389-2408-41d2-9120-40553542426b',
    password: 'T4mxyjT4Ki8r',
  });

  discovery.query(
    {
      environment_id: '389abf5e-7ec4-40ae-8377-9d1bee1a93dc',
      collection_id: '6e659796-9481-4947-8583-a2579af55fe5',
      natural_language_query: query,
      passages:true,
      highlight:true

    },
    function(err, response) {
      if (err) {
        console.error(err);
        next();
      } else {
        let answer = response.passages[0].passage_text;
        update.watsonUpdate.output.text=[answer]        
        next();        
      }
    }
  );
}

module.exports = {
    addDiscoveryInfoToUpdate
}
