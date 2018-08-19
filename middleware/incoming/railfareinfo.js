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
  
  const addRailFareInfoToUpdate = {
    type: "incoming",
    name: "add-railfareinfo-to-update",
    controller: (bot, update, next) => {
      if (
        update.watsonUpdate.output.context &&
        update.watsonUpdate.output.context.action.name === "lookupTrainFare"
      ) {
        lookupTrainFare(update, next);
      } else {
        next();
      }
    }
  };

  function getCurrentDate(){
    var today = new Date();
    var dd = today.getDate();
    
    var mm = today.getMonth()+1; 
    var yyyy = today.getFullYear();
    if(dd<10) 
    {
        dd='0'+dd;
    } 
    
    if(mm<10) 
    {
        mm='0'+mm;
    } 
    today = dd+'-'+mm+'-'+yyyy;
    return today;
    
  }
  
  function lookupTrainFare(update, next) {
    let trainnumber = update.watsonUpdate.output.context.action.trainnumber;
    let departurestation =
      update.watsonUpdate.output.context.action.departurestation;
    let destinationstation =
      update.watsonUpdate.output.context.action.destinationstation;
    let age = 32;
    let trainclass = update.watsonUpdate.output.context.action.trainclass;
    let traveldate = getCurrentDate();
  
    let trainfareurl = `https://api.railwayapi.com/v2/fare/train/${trainnumber}/source/${departurestation}/dest/${destinationstation}/age/${age}/pref/${trainclass}/quota/GN/date/${traveldate}/apikey/q9sr7r1kdl/`;
  
    const requestOptions = {
      // Get daily forcasts for the next three days based for the location Amsterdam
      url: trainfareurl,
      json: true
    };
  
    request(requestOptions)
      .then(body => {
        let answer;
        if (body) {
          let fare = body.fare;
          answer = `Train fare from ${departurestation} to ${destinationstation} for ${trainclass} class is ${fare} `;
        } else {
          answer = `Not able to find the train fare`;
        }
  
        update.watsonUpdate.output.text = [answer];
        next();
      })
      .catch(err => {
        console.log(err);
      });
  }
  
  module.exports = {
    addRailFareInfoToUpdate
  };
  