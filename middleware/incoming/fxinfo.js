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

const request = require("request-promise")
  
  const addfxInfoToUpdate = {
    type: "incoming",
    name: "add-fxinfo-to-update",
    controller: (bot, update, next) => {
      if (
        update.watsonUpdate.output.context &&
        update.watsonUpdate.output.context.action.name === "convertcurrency"
      ) {
        convertcurrency(update, next);
      } else {
        next();
      }
    }
  };
  
  function convertcurrency(update, next) {
    let fromCurrency = `${update.watsonUpdate.output.context.action.fromcurrency}`.replace("from ","");
    let toCurrency = `${update.watsonUpdate.output.context.action.tocurrency}`.replace("to ","");
    let amount = update.watsonUpdate.output.context.action.amount
    let query = `${fromCurrency}_${toCurrency}`
    
    let fxConvertorUrl = `http://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=n`;
  
    const requestOptions = {
      // Get daily forcasts for the next three days based for the location Amsterdam
      url: fxConvertorUrl,
      json: true
    };
  
    request(requestOptions)
      .then(body => {
        let answer;
        if(body.results[query]){
          let converstionRate=body.results[query].val
          answer = `Conversion rate from   ${fromCurrency} to ${toCurrency}  is  ${converstionRate}.`;
          if(amount && converstionRate){
            let convertedAmount=converstionRate * amount
            answer = `${answer} For ${amount} in  ${fromCurrency} the equivalent in ${toCurrency} is ${convertedAmount}`
          }

        }else{
          answer = `Conversion rate from   ${fromCurrency} to ${toCurrency}  cannot be found`;
        }
       
  
        update.watsonUpdate.output.text = [answer];
        next();
      })
      .catch(err => {
        console.log(err);
      });
  }
  
  module.exports = {
    addfxInfoToUpdate
  };
  