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
  
  const addSeatInfoToUpdate = {
    type: "incoming",
    name: "add-railseatinfo-to-update",
    controller: (bot, update, next) => {
      if (
        update.watsonUpdate.output.context &&
        update.watsonUpdate.output.context.action.name === "lookupSeatInfo"
      ) {
        lookupSeatInfo(update, next);
      } else {
        next();
      }
    }
  };
  
  function lookupSeatInfo(update, next) {
    let trainnumber = update.watsonUpdate.output.context.action.trainnumber;
    let departurestation =
      update.watsonUpdate.output.context.action.departurestation;
    let destinationstation =
      update.watsonUpdate.output.context.action.destinationstation;
    let age = 32;
    let trainclass = update.watsonUpdate.output.context.action.trainclass;
    let traveldate = update.watsonUpdate.output.context.action.traveldate;
  
    let seatInfourl = `https://api.railwayapi.com/v2/check-seat/train/${trainnumber}/source/${departurestation}/dest/${destinationstation}/date/${traveldate}/pref/${trainclass}/quota/GN/apikey/q9sr7r1kdl/`;
    console.log(seatInfourl);
  
    const requestOptions = {
      // Get daily forcasts for the next three days based for the location Amsterdam
      url: seatInfourl,
      json: true
    };
  
    request(requestOptions)
      .then(body => {
        let answer;
        if (body.availability) {
          let availability;
          if (body.availability.length > 0) {
            availability = body.availability[0].status;
          } else {
            availability = "NONE";
          }
  
          answer = `Seat availability for travel  ${departurestation} to ${destinationstation} for ${trainclass} on  ${traveldate} is : [ ${availability} ] `;
        } else {
          answer = `Not able to find the train seat availability information`;
        }
  
        update.watsonUpdate.output.text = [answer];
        next();
      })
      .catch(err => {
        console.log(err);
      });
  }
  
  module.exports = {
    addSeatInfoToUpdate
  };
  