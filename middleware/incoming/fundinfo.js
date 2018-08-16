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


const addMFInfoToUpdate = {
  type: 'incoming',
  name: 'add-mfprice-to-update',
  controller: (bot, update, next) => {
    

    if (update.watsonUpdate.output.context  && update.watsonUpdate.output.context.action.name === 'lookupMF') {
        lookupMFPrice(update,next)        
    }else if(update.watsonUpdate.intents.length >0 && update.watsonUpdate.intents[0].intent === "get-mf-info"
    ){
        update.watsonUpdate.output.text=["Cannot locate fund, Can you be more specific"]
        next();       
    }
     else {
        next();       
    }
  }
}

function lookupMFPrice(update, next) {
    
   let amfiCode = `${mfCodelookup(update.watsonUpdate.output.context.action.fundname)}.json` ;
   let mfpriceUrl =`https://www.quandl.com/api/v3/datasets/AMFI/${amfiCode}?api_key=kWqs3Gjd5zBTpYy5htZt`

   const requestOptions = {
    // Get daily forcasts for the next three days based for the location Amsterdam
    url: mfpriceUrl, 
    json: true,
    }

    request(requestOptions)
    .then((body) => {      
        let returnResponse=body.dataset.data[0]  
        let asOfDate=returnResponse[0]
        let nav=returnResponse[1]
        
        let answer =`🗠 The nav for ${update.watsonUpdate.output.context.action.fundname}  as on ${asOfDate} was ${nav}₹`

         update.watsonUpdate.output.text=[answer]
        next();
    })
    .catch((err) => {
        console.log(err);
    })
}

function mfCodelookup(name){
    let mfrepo={
        "ICICI Prudential Banking and PSU Debt Fund - Direct Plan" :'120257',
        'ICICI Prudential Focused Equity Fund Direct Growth':'120722',
        'ICICI Prudential Focused Equity Fund Direct Dividend':'120723',
        'IDBI FOCUSED 30 EQUITY FUND-Growth Direct':'141920',
        'IDBI FOCUSED 30 EQUITY FUND-Growth Regular':'141919'        
    }
   
    let mdCode= mfrepo[name]
    return mdCode
}



module.exports = {
    addMFInfoToUpdate
}
