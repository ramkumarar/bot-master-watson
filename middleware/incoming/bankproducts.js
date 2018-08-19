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
  
  const addbankproductInfoToUpdate = {
    type: "incoming",
    name: "add-bankproductinfo-to-update",
    controller: (bot, update, next) => {
      if (
        update.watsonUpdate.output.context &&
        update.watsonUpdate.output.context.action.name === "lookupbankproducts"
      ) {
        lookupbankproducts(update, next);
      } else {
        next();
      }
    }
  };

  function lookupBankBaseUrl(bankName){
    if(bankName === 'natwest'){
      return "openapi.natwest.com"
    }else if(bankName === 'rbs'){
      return "openapi.rbs.co.uk"
    }else if(bankName === 'ulster'){
      return "openapi.ulsterbank.co.uk"
    }

  }
  
  function lookupbankproducts(update, next) {
    let bankname = update.watsonUpdate.output.context.action.bankname;
    let bankingproducttype = update.watsonUpdate.output.context.action.bankingproducttype;   
    
    let productsUrl = `https://${lookupBankBaseUrl(bankname)}/open-banking/v2.1/${bankingproducttype}-current-accounts`;
  
    const requestOptions = {
      // Get daily forcasts for the next three days based for the location Amsterdam
      url: productsUrl,
      json: true
    };
  
    request(requestOptions)
      .then(body => {
        let answer;
        let ca = bankingproducttype === 'personal' ? 'PCA' : 'BCA'
        let marketingstate= bankingproducttype === 'personal' ? 'PCAMarketingState' : 'BCAMarketingState'
        let head = `Refer below for Personal current accounnt products offered by  ${bankname} </br>`;
        let listValuesAsString = body.data[0].Brand[0][ca].reduce((result, product) => {          
          let producturl = `<a href= ${product[marketingstate][0].CoreProduct.ProductURL}>${product.Name}</a>`
          result += `<li>${producturl}: ${product[marketingstate][0].CoreProduct.ProductDescription}  </li>`;                    
          return result;
        }, '');
        answer = `<ol> ${listValuesAsString} </ol>`        
  
        update.watsonUpdate.output.text = [answer];
        next();
      })
      .catch(err => {
        console.log(err);
      });
  }
  
  module.exports = {
    addbankproductInfoToUpdate
  };
  