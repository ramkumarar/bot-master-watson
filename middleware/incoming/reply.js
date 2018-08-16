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


const replyToUser = {
  type: 'incoming',
  name: 'reply-to-user',
  controller: (bot, update) => {    
     submitMessage(bot, update);    
  }
};

function submitMessage(bot, update) {      
  let emojiWithText
  if(update.watsonUpdate.output.tone) {
      let emotion=update.watsonUpdate.output.tone           
      
      if(update.watsonUpdate.output.nodes_visited[0] ==="Anything else"){
        emojiWithText=fetchEmojiWithText(emotion) 
        update.watsonUpdate.output.text=emojiWithText
      }else{
        update.watsonUpdate.output.text = [`${update.watsonUpdate.output.text[0]} ${fetchEmoji(emotion)}`]
      }
      
  }

    
   return bot.sendTextCascadeTo(update.watsonUpdate.output.text, update.sender.id);        
    
}

function fetchEmojiWithText(emotion){
  let emoji = fetchEmoji(emotion)
  if(emotion === 'Joy'){
    return [`Glad that you are ${emoji}`]
  }else if(emotion === 'Anger'){
    return [`Anger is not good for health ${emoji} `]
  }else if(emotion === 'Sadness'){
    return [`Can i be of any help ?${emoji} `]
  }else if(emotion === 'Fear'){
    return [`${emoji}`]
  }else if(emotion === 'Disgust'){
    return [`${emoji}`]
  }
}

function fetchEmoji(emotion){
  if(emotion === 'Joy'){
    return '😊'
  }else if(emotion === 'Anger'){
    return  '👿'        
  }else if(emotion === 'Sadness'){
    return '😥'
  }else if(emotion === 'Fear'){
    return '😨'
  }else if(emotion === 'Disgust'){
    return '😞'
  }
}

module.exports = {
  replyToUser
}
