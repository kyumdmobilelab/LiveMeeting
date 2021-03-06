var urlSearchParams = new URLSearchParams(location.search);

if (urlSearchParams.get("user") === null || 
    urlSearchParams.get("user") === "" ||
    urlSearchParams.get("room") === null ||
    urlSearchParams.get("room") === "") 
{
    if (/Mobi/.test(navigator.userAgent)) {
        // mobile
        window.location.href = "mobile.html";
    } else {
        // desktop
        window.location.href = "index.html";
    }
}

if (navigator.geolocation) {
    navigator.geolocation.watchPosition(updateMyPosition);
}

function listButton_Click() {
    if (document.getElementById("connectControls").style.display == 'none') {
        document.getElementById("connectControls").style.display = 'block';
    } else {
        document.getElementById("connectControls").style.display = 'none';
    }
}

function leaveRoomButton_Click() {
    if (confirm("Leave this room?")) {
        easyrtc.hangupAll();
        let currentRoomName = urlSearchParams.get("room");
        if (currentRoomName === null || currentRoomName === "")  {
            currentRoomName = "default";
        }
        
        easyrtc.leaveRoom(currentRoomName, 
            function(roomName) {
                console.log("No longer in room " + roomName);

                if (urlSearchParams.get("os") == "android") {
                    B4A.CallSub('leaveRoom', true);
                    return;
                }
        
                if (/Mobi/.test(navigator.userAgent)) {
                    // mobile
                    window.location.href = "mobile.html";
                } else {
                    // desktop
                    window.location.href = "index.html";
                }
            },
            function(errorCode, errorText, roomName) {
                console.log("had problems leaving " + roomName);
            });
    }
}

var trackYourselfTimerId = null;
var myCurrentLocation = null;
var personMap = null;
var markerArray = [];

function initMap() {
    let uluru = {lat: 25.0782782, lng: 121.537494};

    personMap = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: uluru
    });

    if ("geolocation" in navigator) {
        //geolocation is available
        navigator.geolocation.getCurrentPosition(function(position) {
            let center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            //do_something(position.coords.latitude, position.coords.longitude);
            personMap.setCenter(center)

            let marker = new google.maps.Marker({
                position: center,
                title: "123456",
                label: {text: "My Location", color: "#5151A2",  fontSize: "16px", fontWeight: "bold"},
                icon: "images/marker-s.png",
                map: personMap
            });
            markerArray.push(marker);
        });
    } else {
        //geolocation IS NOT available
    }

}

function updateMyPosition(position) {
    console.log(position.coords.latitude + ", " + position.coords.longitude);
    let pLabel = document.getElementById("MyPosition");
    pLabel.innerText = "Current Location: " + position.coords.latitude + ", " + position.coords.longitude

    myCurrentLocation = position;
}

function gotoMyLocation() {
    let center = new google.maps.LatLng(myCurrentLocation.coords.latitude, myCurrentLocation.coords.longitude);
    personMap.panTo(center);
}

function toggleTrackYourselfCheckbox(element) {
    //console.log(element.checked)
    if (element.checked == true) {
        trackYourselfTimerId = window.setInterval(function() {
            console.log("trackYourself Timer ...");
            gotoMyLocation();
        }, 3000);
    } else {
        if (trackYourselfTimerId != null) {
            window.clearInterval(trackYourselfTimerId);
        }
    }
}

function toggleVideoDisableCheckbox(element) {
    console.log(element.checked)
    if (element.checked == true) {
        easyrtc.enableVideo(false);
    } else {
        easyrtc.enableVideo(true);
    }
}

function toggleAudioDisableCheckbox(element) {
    console.log(element.checked)
    if (element.checked == true) {
        easyrtc.enableAudio(false);
    } else {
        easyrtc.enableAudio(true);
    }
}


//-------------------------------------------------------------------//

var selfEasyrtcid = "";
var easyrtcidArray = null;

function connect() {
    // user name
    if (urlSearchParams.get("user") != null) {
        easyrtc.setUsername(urlSearchParams.get("user"));        
    }

    // room
    if (urlSearchParams.get("room") != null) {
        easyrtc.joinRoom(urlSearchParams.get("room"), null, null, null);
    }

    // hide recordButtons
    if (urlSearchParams.get("hideRecord") == "y") {
        document.getElementById("recordButtons").style.display = 'none';
    } else {
        document.getElementById("recordButtons").style.display = 'block';
    }

    // is mobile
    if (urlSearchParams.get("isMobile") == "y") {
        document.getElementById("recordButtons").style.display = 'none';
        let trackYourselfCheckbox = document.getElementById("trackYourselfCheckbox");
        trackYourselfCheckbox.checked = true;
        toggleTrackYourselfCheckbox(trackYourselfCheckbox);
    } else {
        document.getElementById("recordButtons").style.display = 'block';
        // document.getElementById("callerVideo").style.height = "320px";
        // document.getElementById("callerVideo").style.width = "480px";
        document.getElementById("trackYourself").style.display = 'none';
    }

    
    if( !easyrtc.supportsRecording()) {
       //window.alert("This browser does not support recording. Try chrome or firefox.");
       document.getElementById("recordButtons").style.display = 'none';
    } else {
        if( easyrtc.isRecordingTypeSupported("h264")) document.getElementById("useH264").disabled = false;
        if( easyrtc.isRecordingTypeSupported("vp9")) document.getElementById("useVP9").disabled = false;
        if( easyrtc.isRecordingTypeSupported("vp8")) document.getElementById("useVP8").disabled = false;
    }

    
    easyrtc.setPeerListener(addToConversation);
    easyrtc.setVideoDims(640,480);
    easyrtc.setRoomOccupantListener(convertListToButtons);
    easyrtc.easyApp("easyrtc.audioVideoSimple", "selfVideo", ["callerVideo"], loginSuccess, loginFailure);


    // 每幾秒就更新一下地圖
    window.setInterval(function() {
        console.log("timer...");
        if (personMap != null) {
            // 刪除地圖裡的 marker
            while(markerArray.length){
                markerArray.pop().setMap(null);
            }
            //
            //...
        }
    }, 8000);

    //如果是 mobile 端，持續送出本地座標
    if (urlSearchParams.get("isMobile") == "y") {
        window.setInterval(function() {
            console.log("mobile timer ...");
            
        }, 4000);
    }
}

function addToConversation(who, msgType, content) {
    // Escape html special characters, then add linefeeds.
    content = content.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    content = content.replace(/\n/g, '<br />');
    let conversationObj = document.getElementById('conversation');
    conversationObj.innerHTML += "<b>&nbsp;" + easyrtc.idToName(who) + ":</b>&nbsp;" + content + "<br />";
    conversationObj.scrollTop = conversationObj.scrollHeight;
}

function sendMessageButton_Click(){
    sendStuffP2P();
}

function sendStuffP2P() {
    var text = document.getElementById('sendMessageText').value;
    if(text.replace(/\s/g, "").length === 0) { // Don't send just whitespace
        return;
    }

    for(let easyrtcid in easyrtcidArray) {
        easyrtc.sendPeerMessage(easyrtcid, "im",  text);
    }
    
    addToConversation("Me", "message", text);
    document.getElementById('sendMessageText').value = "";
}


function clearConnectList() {
    var otherClientDiv = document.getElementById('otherClients');
    while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
    }
}


function convertListToButtons (roomName, data, isPrimary) {
    document.getElementById("roomname").innerHTML = "Room: " + roomName;
    clearConnectList();
    var otherClientDiv = document.getElementById('otherClients');
    for(var easyrtcid in data) {
        var button = document.createElement('button');
        button.onclick = function(easyrtcid) {
            return function() {
                performCall(easyrtcid);
            };
        }(easyrtcid);

        var label = document.createTextNode(easyrtc.idToName(easyrtcid));
        button.appendChild(label);
        otherClientDiv.appendChild(button);

        let br = document.createElement("br");
        otherClientDiv.appendChild(br);
    }
    easyrtcidArray = data;
}


function performCall(otherEasyrtcid) {
    easyrtc.hangupAll();
    var successCB = function() { };
    var failureCB = function() {};
    easyrtc.call(otherEasyrtcid, successCB, failureCB);
}


function loginSuccess(easyrtcid) {
    selfEasyrtcid = easyrtcid;
    if (easyrtc.username == null) {
        document.getElementById("iam").innerHTML = "I am \"" + easyrtc.cleanId(easyrtcid) + "\".";
    } else {
        document.getElementById("iam").innerHTML = "I am \"" + easyrtc.username + "\".";
    }
    document.getElementById("startRecording").disabled = false;
}


function loginFailure(errorCode, message) {
    easyrtc.showError(errorCode, message);
}


var selfRecorder = null;
var callerRecorder = null;

function startRecording() {
    var selfLink = document.getElementById("selfDownloadLink");
    selfLink.innerText = "";

    selfRecorder = easyrtc.recordToFile( easyrtc.getLocalStream(), 
               selfLink, "selfVideo");
    if( selfRecorder ) {
       document.getElementById("startRecording").disabled = true;
       document.getElementById("stopRecording").disabled = false;
    }
    else {
       window.alert("failed to start recorder for self");
       return;
    }

    var callerLink = document.getElementById("callerDownloadLink");
    callerLink.innerText = "";

    if( easyrtc.getIthCaller(0)) {
       callerRecorder = easyrtc.recordToFile(
           easyrtc.getRemoteStream(easyrtc.getIthCaller(0), null), 
             callerLink, "callerVideo");
       if( !callerRecorder ) {
          window.alert("failed to start recorder for caller");
       }
    }
    else {
       callerRecorder = null;
    }
}


function endRecording() {
    if( selfRecorder ) {
       selfRecorder.stop();
    }
    if( callerRecorder ) {
       callerRecorder.stop();
    }
    document.getElementById("startRecording").disabled = false;
    document.getElementById("stopRecording").disabled = true;
}
