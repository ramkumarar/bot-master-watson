var Speech = (function() {

var final_transcript = '';
var recognizing = false;
var ignore_onend;
var start_timestamp;
var recognition;

     //Initialize the module
  function init() {
    SpeechSetup();
  }

  function SpeechSetup(){
    if (!('webkitSpeechRecognition' in window)) {
        upgrade();
      } else {
        start_button.style.display = 'inline-block';
        recognition = new webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
      
        recognition.onstart = function() {
          recognizing = true;          
          start_img.src = 'images/mic-animate.gif';
        };
      
        recognition.onerror = function(event) {
          if (event.error == 'no-speech') {
            start_img.src = 'images/mic.gif';
            console.log('info_no_speech');
            ignore_onend = true;
          }
          if (event.error == 'audio-capture') {
            start_img.src = 'images/mic.gif';
            console.log('info_no_microphone');
            ignore_onend = true;
          }
          if (event.error == 'not-allowed') {
            if (event.timeStamp - start_timestamp < 100) {
              console.log('info_blocked');
            } else {
              console.log('info_denied');
            }
            ignore_onend = true;
          }
        };
      
        recognition.onend = function() {
          recognizing = false;
          if (ignore_onend) {
            return;
          }
          start_img.src = 'images/mic.gif';
          if (!final_transcript) {      
            return;
          }
          
        
          
        };
      
        recognition.onresult = function(event) {
          var interim_transcript = '';
          for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              final_transcript += event.results[i][0].transcript;
            } else {
              interim_transcript += event.results[i][0].transcript;
            }
          }
          document.getElementById("textInputOne").value=final_transcript

          setTimeout(() => {
            const ke = new KeyboardEvent("keydown", {
                bubbles: true, cancelable: true, keyCode: 13
            });
            document.getElementById("textInputOne").dispatchEvent(ke);   
            final_transcript = '';
          }, 3000);
        

         // final_transcript = capitalize(final_transcript);
          console.log(final_transcript)
         // final_span.innerHTML = linebreak(final_transcript);
          //interim_span.innerHTML = linebreak(interim_transcript);
         
        };
      }
  }

  function startButton(event) {
    if (recognizing) {
      recognition.stop();
      return;
    }
    final_transcript = '';
    recognition.lang = 'en-US';
    recognition.start();
    ignore_onend = false;
  
    start_img.src = 'images/mic-slash.gif';
    
    
    start_timestamp = event.timeStamp;
  }

  function upgrade() {
    start_button.style.visibility = 'hidden';
    console.log('info_upgrade')
    
  }


  return {
    init: init,
    startButton:startButton
  };

}());
