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


const addWeatherInfoToUpdate = {
  type: 'incoming',
  name: 'add-weather-to-update',
  controller: (bot, update, next) => {

    

    if (update.watsonUpdate.output.context  && update.watsonUpdate.output.context.action.name === 'lookupWeather') {
        lookupWeather(update,next)        
    } else {
        next();       
    }
  }
}

function lookupWeather(update, next) {
    
   let locationInIndia = `${update.watsonUpdate.output.context.action.location},IN` ;
   let weatherUrl ='https://openweathermap.org/data/2.5/weather?q=' + locationInIndia + '&appid=b6907d289e10d714a6e88b30761fae22'

   const requestOptions = {
    // Get daily forcasts for the next three days based for the location Amsterdam
    url: weatherUrl, 
    json: true,
    }

    request(requestOptions)
    .then((body) => {        

        let answer=`The current temperature in ${body.name} is ${body.main.temp} °C. Today we had a min temperature of ${body.main.temp_min} and max temperature of ${body.main.temp_max}.`
        if(body.clouds.all && body.clouds.all > 70) {
            answer =`${answer} We have a cloudy weather today ☁️`
        }
        

         update.watsonUpdate.output.text=[answer]
        next();
    })
    .catch((err) => {
        console.log(err);
    })
}

module.exports = {
  addWeatherInfoToUpdate
}
