var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
recognition.lang = 'en-US';
var microphoneEnabled = false;
var scrollingUp = false;
var scrollingDown = false;
var scroll;
var speed = 1;
var interval = 20;
var speeds =    [    1,   1,   1,  1,  2,  4,  6];
var intervals = [150,100,50, 20, 20, 20, 20];
var i = 3;
var tab = chrome.tabs.getCurrent;
var scrollingTab;
var permissionAsked = false;
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
    stopScroll();
  }
}
chrome.browserAction.onClicked.addListener(updateMicrophoneState);

function scrollUp() {
    console.log('Recognized word: Scroll UP');
    startScrollUp();
}

function scrollDown() {
    console.log('Recognized word: Scroll DOWN');
    startScrollDown();
}


function Stop() {
    console.log('Recognized word: STOP');
    terminateScroll();
}


recognition.onresult = function(event) {
    var result = event.results[0][0].transcript;
    console.log(result);
    if(result.includes('stop')){
        Stop();
    }
    else if(result.includes('app')||result.includes('up')){
        scrollUp();
    }
    else if(result.includes('own'||'un')){
        scrollDown();
    }
    else if(result.includes('st'||'fa')){
        increaseSpeed();
    }
    else if(result.includes('low'||result.includes('ll'))){
        decreaseSpeed();
    }

}

recognition.onerror = function(event) {
    switch(event.error){
        case 'not-allowed':
        var permissionUrl = 'permission.html';
        if(!permissionAsked){
            permissionAsked = true;
            chrome.tabs.create({ url: permissionUrl });
        }
        console.log("error");
    };
   // permissionAsked = false;
}

recognition.onend = function() {
    if(microphoneEnabled){
        recognition.start();
    }
};

function increaseSpeed() {
    if((i+1)<7){
        i++;
    }
    speed = speeds[i];
    interval = intervals[i];
    if(speed == 1){
        clearInterval(scroll);
        startScroll();
    } 
    console.log( speed +'/'+ interval);
}

function decreaseSpeed() {
    if(i>0){
        i--;
    }
    speed = speeds[i];
    interval = intervals[i];
    if(speed == 1){
        clearInterval(scroll);
        startScroll();
    }
    console.log( speed +'/'+ interval);
} 

function startScroll(){
    if(scrollingUp){
        scrollingUp = false;
        startScrollUp();
    }
    if(scrollingDown){
        scrollingDown = false;
        startScrollDown();
    }
}
function startScrollDown() { 
   if(!scrollingUp&&!scrollingDown){
       scrollingTab = chrome.tabs.getCurrent;
       console.log('Scroll Down started');
       scroll = setInterval(function(){  
           chrome.tabs.update(scrollingTab.id, 
                   {'url': 
       'javascript:document.documentElement.scrollTop+='+speed+';'});
      // console.log('..scrolling down'+speed);
      }, interval);
       scrollingDown = true;
   }
   else if(scrollingUp){
        stopScroll();
        startScrollDown();
   }
}
 

function startScrollUp() { 
   if(!scrollingUp&&!scrollingDown){
       scrollingTab = chrome.tabs.getCurrent;
       console.log('Scroll UP started');
       scroll = setInterval(function(){  
           chrome.tabs.update(scrollingTab.id, 
                   {'url': 
       'javascript:document.documentElement.scrollTop-='+speed+';'});
       //console.log('..scrolling up'+speed);
       }, interval);
       scrollingUp = true;
   }
   else if(scrollingDown){
        stopScroll();
        startScrollUp();
   }
}

function stopScroll() {
    if(scrollingUp||scrollingDown){
        console.log('Scroll stopped');
        clearInterval(scroll);
        scrollingUp = false;
        scrollingDown = false;
    }
}

function terminateScroll() {
    if(scrollingUp||scrollingDown){
        console.log('Scroll terminated');
        clearInterval(scroll);
        scrollingUp = false;
        scrollingDown = false;
        i = 3;
        speed = speeds[i];
        interval = intervals[i];
    }
}

