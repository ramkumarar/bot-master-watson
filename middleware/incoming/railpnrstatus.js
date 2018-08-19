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
  
  const addPnrInfoToUpdate = {
    type: "incoming",
    name: "add-pnrinfo-to-update",
    controller: (bot, update, next) => {
      if (
        update.watsonUpdate.output.context &&
        update.watsonUpdate.output.context.action.name === "lookuppnrInfo"
      ) {
        lookuppnrInfo(update, next);
      } else {
        next();
      }
    }
  };
  
  function lookuppnrInfo(update, next) {
    let pnrnumber = update.watsonUpdate.output.context.action.pnrnumber;
    
  
    
    let pnrStatusurl = `https://api.railwayapi.com/v2/pnr-status/pnr/${pnrnumber}/apikey/q9sr7r1kdl/`;


  
    const requestOptions = {
      // Get daily forcasts for the next three days based for the location Amsterdam
      url: pnrStatusurl,
      json: true
    };
  
    request(requestOptions)
      .then(body => {
        let answer;

        answer = `You travel from   ${body.boarding_point.name} to ${body.to_station.name} on  ${body.doj} is  ${body.passengers[0].current_status}. Your booking status was ${body.passengers[0].booking_status}`;
  
        update.watsonUpdate.output.text = [answer];
        next();
      })
      .catch(err => {
        console.log(err);
      });
  }
  
  module.exports = {
    addPnrInfoToUpdate
  };
  