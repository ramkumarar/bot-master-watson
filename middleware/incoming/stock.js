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


const addStockInfoToUpdate = {
  type: 'incoming',
  name: 'add-stockprice-to-update',
  controller: (bot, update, next) => {
    

    if (update.watsonUpdate.output.context  && update.watsonUpdate.output.context.action.name === 'lookupStock') {
        lookupStockPrice(update,next)        
    } else {
        next();       
    }
  }
}

function lookupStockPrice(update, next) {
    
   let symbol = `NSE:${stockCodelookup(update.watsonUpdate.output.context.action.company)}` ;
   let stockpriceUrl =`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&outputsize=full&apikey=MCAF9B429I44328U`

   const requestOptions = {
    // Get daily forcasts for the next three days based for the location Amsterdam
    url: stockpriceUrl, 
    json: true,
    }

    request(requestOptions)
    .then((body) => {        
        let timeSeries=body["Time Series (Daily)"]
        let latestPrice=timeSeries[Object.keys(timeSeries)[0]];
        let open= latestPrice["1. open"]
        let min= latestPrice["3. low"]
        let max= latestPrice["2. high"]
        let volume= latestPrice["6. volume"]
        let answer =`The stock ${symbol} opened the day at ${open} ₹ and the day price ranged between ${min} ₹ and ${max} ₹ with a volume of ${volume}`


         update.watsonUpdate.output.text=[answer]
        next();
    })
    .catch((err) => {
        console.log(err);
    })
}

function stockCodelookup(name){
    let stockrepo={
        "ACC Ltd" :'ACC',
        "Aditya Birla Capital Ltd" :'ABCAPITAL',
        "Ashok Leyland Ltd" :'ASHOKLEY',
        "Aurobindo Pharma Ltd" :'AUROPHARMA',
        "Axis Bank Ltd" :'AXISBANK',
        "Bajaj Finance Ltd" :'BAJFINANCE',
        "Bank of Baroda" :'BANKBARODA',
        "Bharat Heavy Electricals Ltd" :'BHEL',
        "Bharti Airtel Ltd" :'BHARTIARTL',
        "Bosch Ltd" :'BOSCHLTD',
        "Cadila Healthcare Ltd" :'CADILAHC',
        "Coal India Ltd" :'COALINDIA',
        "Container Corporation of India Ltd" :'CONCOR',
        "DLF Ltd" :'DLF',
        "Dr Reddy's Laboratories Ltd" :'DRREDDY',
        "Emami Ltd" :'EMAMILTD',
        "General Insurance Corporation of India" :'GICRE',
        "Grasim Industries Ltd" :'GRASIM',
        "HDFC Bank Ltd" :'HDFCBANK',
        "Hero MotoCorp Ltd" :'HEROMOTOCO',
        "Hindustan Petroleum Corporation Ltd" :'HINDPETRO',
        "Hindustan Zinc Ltd" :'HINDZINC',
        "I T C Ltd" :'ITC',
        "ICICI Prudential Life Insurance Company Ltd" :'ICICIPRULI',
        "Indiabulls Housing Finance Ltd" :'IBULHSGFIN',
        "IndusInd Bank Ltd" :'INDUSINDBK',
        "InterGlobe Aviation Ltd" :'INDIGO',
        "Kotak Mahindra Bank Ltd" :'KOTAKBANK',
        "LIC Housing Finance Ltd" :'LICHSGFIN',
        "Lupin Ltd" :'LUPIN',
        "Mahindra & Mahindra Ltd" :'M&M',
        "Maruti Suzuki India Ltd" :'MARUTI',
        "NHPC Ltd" :'NHPC',
        "NTPC Ltd" :'NTPC',
        "Oil India Ltd" :'OIL',
        "Petronet LNG Ltd" :'PETRONET',
        "Piramal Enterprises Ltd" :'PEL',
        "Power Grid Corporation of India Ltd" :'POWERGRID',
        "Punjab National Bank" :'PNB',
        "Rural Electrification Corporation Ltd" :'RECLTD',
        "Shree Cement Ltd" :'SHREECEM',
        "Siemens Ltd" :'SIEMENS',
        "Steel Authority of India Ltd" :'SAIL',
        "Sun TV Network Ltd" :'SUNTV',
        "Tata Motors Ltd DVR" :'TATAMTRDVR',
        "Tata Steel Ltd" :'TATASTEEL',
        "Titan Company Ltd" :'TITAN',
        "UltraTech Cement Ltd" :'ULTRACEMCO',
        "Vedanta Ltd" :'VEDL',
        "Yes Bank Ltd" :'YESBANK',
        "Zee Entertainment Enterprises Ltd":'ZEEL'
    }
   
    let stockCode= stockrepo[name]
    return stockCode
}



module.exports = {
    addStockInfoToUpdate
}
