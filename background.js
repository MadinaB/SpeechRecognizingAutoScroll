var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
recognition.lang = 'en-US';
var microphoneEnabled = false;
disableMicrophone();

function disableMicrophone() {
  chrome.browserAction.setIcon({path:"img/disabled.png"});
  recognition.stop();
  console.log('Recognition stopped');
}

function enableMicrophone() {
  chrome.browserAction.setIcon({path:"img/enabled.png"});
  recognition.start();
  console.log('Recognition started');
}

function updateMicrophoneState() {
  if ( microphoneEnabled == false ) {
    microphoneEnabled = true;
    enableMicrophone();
  } else {
    microphoneEnabled = false;
    disableMicrophone();
  }
}
chrome.browserAction.onClicked.addListener(updateMicrophoneState);

function scrollUp() {
    console.log('Scroll UP');
}

function scrollDown() {
    console.log('Scroll DOWN');
}


function Stop() {
    console.log('STOP');
}



recognition.onresult = function(event) {
    var result = event.results[0][0].transcript;
    if(result.includes('stop')){
        Stop();
    }
    else if(result.includes('app')||result.includes('up')){
        scrollUp();
    }
    else if(result.includes('own')){
        scrollDown();
    }

}

recognition.onerror = function(event) {
    var path = 'chrome-extension://';
    var id ='ogbmjdecolnfcpomiajabjidakfncmgf';
    var page = '/permission.html';
    var webAddress = path+id+page;
    switch(event.error){
        case 'not-allowed':
        navigator.webkitGetUserMedia({
            audio: true,
            }, function(stream) {
            stream.stop();
            }, function() {
            });
    };
    console.log("error");
}

recognition.onend = function() {
    if(microphoneEnabled){
        recognition.start();
    }
};
