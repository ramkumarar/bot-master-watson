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
const ToneAnalyzerV3 = require('watson-developer-cloud/tone-analyzer/v3');


const addToneInfoToUpdate = {
  type: 'incoming',
  name: 'add-tone-to-update',
  controller: (bot, update, next) => {
    

    if (update.message.text) {
        lookupTone(update,next)        
    } else {
        next();
    }
  }
}

function lookupTone(update, next) {

    const toneAnalyzer = new ToneAnalyzerV3({
        version_date: '2017-02-03', 
        username: '8167a84a-7994-447f-ad30-0bc6f991cb7a',
        password: 'abw5ooWW6hPk',
      });


      const toneParams = { 'text': update.message.text};

      
      toneAnalyzer.tone(toneParams, function (error, toneAnalysis) {
        if (error) {
          console.log(error);
        } else { 
          // let result = JSON.stringify(toneAnalysis, null, 2);
          let result=toneAnalysis.document_tone.tone_categories[0].tones.filter( tone => 
            tone.score >0.75)

            if(result.length>0 && update.watsonUpdate.output){
               update.watsonUpdate.output.tone=result[0].tone_name
            }

           
        }
        next();
      });
    }
      
      
    




module.exports = {
    addToneInfoToUpdate
}
