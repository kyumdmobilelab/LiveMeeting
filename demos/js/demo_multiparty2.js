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
    if (urlSearchParams.get("os") !== "android") {
        navigator.geolocation.watchPosition(updateMyPosition);
    }
}


//-----------------------------------------------------------//



var activeBox = -1;  // nothing selected
var aspectRatio = 4/3;  // standard definition video aspect ratio
var maxCALLERS = 3;
var numVideoOBJS = maxCALLERS+1;
var layout;


easyrtc.dontAddCloseButtons(true);

function getIdOfBox(boxNum) {
    return "box" + boxNum;
}


function reshapeFull(parentw, parenth) {
    return {
        left:0,
        top:0,
        width:parentw,
        height:parenth
    };
}

function reshapeTextEntryBox(parentw, parenth) {
    return {
        left:parentw/10,
        top:parenth/4,
        width:(parentw/5)*4,
        height: parenth/4
    }
}

function reshapeTextEntryField(parentw, parenth) {
    return {
        width:parentw -40
    }
}

function reshapeMobileMap(parentw, parenth) {
    return {
        left:parentw/25,
        top:parenth/4,
        width:(parentw/10)*9,
        height: (parenth/7)*5
    }
}

function reshapeMobileControlsPanel(parentw, parenth) {
    return {
        left:parentw/25,
        top:parenth/4,
        width:(parentw/10)*9,
        height: (parenth/7)*5
    }
}


var margin = 20;

function reshapeToFullSize(parentw, parenth) {
    var left, top, width, height;
    var margin= 20;

    if( parentw < parenth*aspectRatio){
        width = parentw -margin;
        height = width/aspectRatio;
    }
    else {
        height = parenth-margin;
        width = height*aspectRatio;
    }
    left = (parentw - width)/2;
    top = (parenth - height)/2;
    return {
        left:left,
        top:top,
        width:width,
        height:height
    };
}

//
// a negative percentLeft is interpreted as setting the right edge of the object
// that distance from the right edge of the parent.
// Similar for percentTop.
//
function setThumbSizeAspect(percentSize, percentLeft, percentTop, parentw, parenth, aspect) {

    var width, height;
    if( parentw < parenth*aspectRatio){
        width = parentw * percentSize;
        height = width/aspect;
    }
    else {
        height = parenth * percentSize;
        width = height*aspect;
    }
    var left;
    if( percentLeft < 0) {
        left = parentw - width;
    }
    else {
        left = 0;
    }
    left += Math.floor(percentLeft*parentw);
    var top = 0;
    if( percentTop < 0) {
        top = parenth - height;
    }
    else {
        top = 0;
    }
    top += Math.floor(percentTop*parenth);
    return {
        left:left,
        top:top,
        width:width,
        height:height
    };
}


function setThumbSize(percentSize, percentLeft, percentTop, parentw, parenth) {
    return setThumbSizeAspect(percentSize, percentLeft, percentTop, parentw, parenth, aspectRatio);
}

function setThumbSizeButton(percentSize, percentLeft, percentTop, parentw, parenth, imagew, imageh) {
    return setThumbSizeAspect(percentSize, percentLeft, percentTop, parentw, parenth, imagew/imageh);
}


var sharedVideoWidth  = 1;
var sharedVideoHeight = 1;

function reshape1of2(parentw, parenth) {
    if( layout== 'p' ) {
        return {
            left: (parentw-sharedVideoWidth)/2,
            top:  (parenth -sharedVideoHeight*2)/3,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    }
    else {
        return{
            left: (parentw-sharedVideoWidth*2)/3,
            top:  (parenth -sharedVideoHeight)/2,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        }
    }
}



function reshape2of2(parentw, parenth){
    if( layout== 'p' ) {
        return {
            left: (parentw-sharedVideoWidth)/2,
            top:  (parenth -sharedVideoHeight*2)/3 *2 + sharedVideoHeight,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    }
    else {
        return{
            left: (parentw-sharedVideoWidth*2)/3 *2 + sharedVideoWidth,
            top:  (parenth -sharedVideoHeight)/2,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        }
    }
}

function reshape1of3(parentw, parenth) {
    if( layout== 'p' ) {
        return {
            left: (parentw-sharedVideoWidth)/2,
            top:  (parenth -sharedVideoHeight*3)/4 ,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    }
    else {
        return{
            left: (parentw-sharedVideoWidth*2)/3,
            top:  (parenth -sharedVideoHeight*2)/3,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        }
    }
}

function reshape2of3(parentw, parenth){
    if( layout== 'p' ) {
        return {
            left: (parentw-sharedVideoWidth)/2,
            top:  (parenth -sharedVideoHeight*3)/4*2+ sharedVideoHeight,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    }
    else {
        return{
            left: (parentw-sharedVideoWidth*2)/3*2+sharedVideoWidth,
            top:  (parenth -sharedVideoHeight*2)/3,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        }
    }
}

function reshape3of3(parentw, parenth) {
    if( layout== 'p' ) {
        return {
            left: (parentw-sharedVideoWidth)/2,
            top:  (parenth -sharedVideoHeight*3)/4*3+ sharedVideoHeight*2,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        };
    }
    else {
        return{
            left: (parentw-sharedVideoWidth*2)/3*1.5+sharedVideoWidth/2,
            top:  (parenth -sharedVideoHeight*2)/3*2+ sharedVideoHeight,
            width: sharedVideoWidth,
            height: sharedVideoHeight
        }
    }
}


function reshape1of4(parentw, parenth) {
    return {
        left: (parentw - sharedVideoWidth*2)/3,
        top: (parenth - sharedVideoHeight*2)/3,
        width: sharedVideoWidth,
        height: sharedVideoHeight
    }
}

function reshape2of4(parentw, parenth) {
    return {
        left: (parentw - sharedVideoWidth*2)/3*2+ sharedVideoWidth,
        top: (parenth - sharedVideoHeight*2)/3,
        width: sharedVideoWidth,
        height: sharedVideoHeight
    }
}
function reshape3of4(parentw, parenth) {
    return {
        left: (parentw - sharedVideoWidth*2)/3,
        top: (parenth - sharedVideoHeight*2)/3*2 + sharedVideoHeight,
        width: sharedVideoWidth,
        height: sharedVideoHeight
    }
}

function reshape4of4(parentw, parenth) {
    return {
        left: (parentw - sharedVideoWidth*2)/3*2 + sharedVideoWidth,
        top: (parenth - sharedVideoHeight*2)/3*2 + sharedVideoHeight,
        width: sharedVideoWidth,
        height: sharedVideoHeight
    }
}

var boxUsed = [true, false, false, false];
var connectCount = 0;


function setSharedVideoSize(parentw, parenth) {
    layout = ((parentw /aspectRatio) < parenth)?'p':'l';
    var w, h;

    function sizeBy(fullsize, numVideos) {
        return (fullsize - margin*(numVideos+1) )/numVideos;
    }

    switch(layout+(connectCount+1)) {
        case 'p1':
        case 'l1':
            w = sizeBy(parentw, 1);
            h = sizeBy(parenth, 1);
            break;
        case 'l2':
            w = sizeBy(parentw, 2);
            h = sizeBy(parenth, 1);
            break;
        case 'p2':
            w = sizeBy(parentw, 1);
            h = sizeBy(parenth, 2);
            break;
        case 'p4':
        case 'l4':
        case 'l3':
            w = sizeBy(parentw, 2);
            h = sizeBy(parenth, 2);
            break;
        case 'p3':
            w = sizeBy(parentw, 1);
            h = sizeBy(parenth, 3);
            break;
    }
    sharedVideoWidth = Math.min(w, h * aspectRatio);
    sharedVideoHeight = Math.min(h, w/aspectRatio);
}

var reshapeThumbs = [
    function(parentw, parenth) {

        if( activeBox > 0 ) {
            return setThumbSize(0.20, 0.01, 0.01, parentw, parenth);
        }
        else {
            setSharedVideoSize(parentw, parenth)
            switch(connectCount) {
                case 0:return reshapeToFullSize(parentw, parenth);
                case 1:return reshape1of2(parentw, parenth);
                case 2:return reshape1of3(parentw, parenth);
                case 3:return reshape1of4(parentw, parenth);
            }
        }
    },
    function(parentw, parenth) {
        if( activeBox >= 0 || !boxUsed[1]) {
            return setThumbSize(0.20, 0.01, -0.01, parentw, parenth);
        }
        else{
            switch(connectCount) {
                case 1:
                    return reshape2of2(parentw, parenth);
                case 2:
                    return reshape2of3(parentw, parenth);
                case 3:
                    return reshape2of4(parentw, parenth);
            }
        }
    },
    function(parentw, parenth) {
        if( activeBox >= 0 || !boxUsed[2] ) {
            return setThumbSize(0.20, -0.01, 0.01, parentw, parenth);
        }
        else  {
            switch(connectCount){
                case 1:
                    return reshape2of2(parentw, parenth);
                case 2:
                    if( !boxUsed[1]) {
                        return reshape2of3(parentw, parenth);
                    }
                    else {
                        return reshape3of3(parentw, parenth);
                    }
                case 3:
                    return reshape3of4(parentw, parenth);
            }
        }
    },
    function(parentw, parenth) {
        if( activeBox >= 0 || !boxUsed[3]) {
            return setThumbSize(0.20, -0.01, -0.01, parentw, parenth);
        }
        else{
            switch(connectCount){
                case 1:
                    return reshape2of2(parentw, parenth);
                case 2:
                    return reshape3of3(parentw, parenth);
                case 3:
                    return reshape4of4(parentw, parenth);
            }
        }
    },
];


function killButtonReshaper(parentw, parenth) {
    var imagew = 128;
    var imageh = 128;
    if( parentw < parenth) {
        return setThumbSizeButton(0.1, -.51, -0.01, parentw, parenth, imagew, imageh);
    }
    else {
        return setThumbSizeButton(0.1, -.01, -.51, parentw, parenth, imagew, imageh);
    }
}


function muteButtonReshaper(parentw, parenth) {
    var imagew = 32;
    var imageh = 32;
    if( parentw < parenth) {
        return setThumbSizeButton(0.10, -.51, 0.01, parentw, parenth, imagew, imageh);
    }
    else {
        return setThumbSizeButton(0.10, 0.01, -.51, parentw, parenth, imagew, imageh);
    }
}

function reshapeTextEntryButton(parentw, parenth) {
    var imagew = 32;
    var imageh = 32;
    if( parentw < parenth) {
        return setThumbSizeButton(0.10, .51, 0.01, parentw, parenth, imagew, imageh);
    }
    else {
        return setThumbSizeButton(0.10, 0.01, .51, parentw, parenth, imagew, imageh);
    }
}


function handleWindowResize() {
    var fullpage = document.getElementById('fullpage');
    fullpage.style.width = window.innerWidth + "px";
    fullpage.style.height = window.innerHeight + "px";

    connectCount = easyrtc.getConnectionCount();

    function applyReshape(obj,  parentw, parenth) {
        var myReshape = obj.reshapeMe(parentw, parenth);

        if(typeof myReshape.left !== 'undefined' ) {
            obj.style.left = Math.round(myReshape.left) + "px";
        }
        if(typeof myReshape.top !== 'undefined' ) {
            obj.style.top = Math.round(myReshape.top) + "px";
        }
        if(typeof myReshape.width !== 'undefined' ) {
            obj.style.width = Math.round(myReshape.width) + "px";
        }
        if(typeof myReshape.height !== 'undefined' ) {
            obj.style.height = Math.round(myReshape.height) + "px";
        }

        var n = obj.childNodes.length;
        for(var i = 0; i < n; i++ ) {
            var childNode = obj.childNodes[i];
            if( childNode.reshapeMe) {
                applyReshape(childNode, myReshape.width, myReshape.height);
            }
        }
    }

    // applyReshape(fullpage, window.innerWidth/2, window.innerHeight);

    if (urlSearchParams.get("isMobile") == "y") {
        if (urlSearchParams.get("os") == "android") {  // Android app
            applyReshape(fullpage, window.innerWidth, window.innerHeight);
        } 
        else {  // Mobile Chrome and Mobile Safari 
            applyReshape(fullpage, window.innerWidth, (window.innerHeight/12)*11 );
            document.getElementById('mobileControlBlock').style.height = (window.innerHeight/12) + "px";
            document.getElementById('mobileControlBlock').style.width = window.innerWidth + "px";
        }
    } else {
        applyReshape(fullpage, window.innerWidth/2, window.innerHeight);
        document.getElementById('controlBlock').style.width = (window.innerWidth/2) - 25 + "px";
        document.getElementById('map').style.width = (window.innerWidth/2) - 25 + "px";
        document.getElementById('map').style.visibility = "visible";
    }
}


function setReshaper(elementId, reshapeFn) {
    var element = document.getElementById(elementId);
    if( !element) {
        alert("Attempt to apply to reshapeFn to non-existent element " + elementId);
    }
    if( !reshapeFn) {
        alert("Attempt to apply misnamed reshapeFn to element " + elementId);
    }
    element.reshapeMe = reshapeFn;
}


function collapseToThumbHelper() {
    if( activeBox >= 0) {
        var id = getIdOfBox(activeBox);
        document.getElementById(id).style.zIndex = 2;
        setReshaper(id, reshapeThumbs[activeBox]);
        document.getElementById('muteButton').style.display = "none";
        document.getElementById('killButton').style.display = "none";
        activeBox = -1;
    }
}

function collapseToThumb() {
    collapseToThumbHelper();
    activeBox = -1;
    updateMuteImage(false);
    handleWindowResize();

}

function updateMuteImage(toggle) {
    var muteButton = document.getElementById('muteButton');
    if( activeBox > 0) { // no kill button for self video
        muteButton.style.display = "block";
        var videoObject = document.getElementById( getIdOfBox(activeBox));
        var isMuted = videoObject.muted?true:false;
        if( toggle) {
            isMuted = !isMuted;
            videoObject.muted = isMuted;

            // android:
            if (urlSearchParams.get("os") == "android") {
                B4A.CallSub('allMutedChange', true);
            }
        }
        muteButton.src = isMuted?"images/button_unmute.png":"images/button_mute.png";

        let muteCheckbox = document.getElementById( "checkbox_" + muteCheckboxIds[getIdOfBox(activeBox)] );
        muteCheckbox.checked = isMuted;
    }
    else {
        muteButton.style.display = "none";
    }
}


function expandThumb(whichBox) {
    //------------------------------
    if (urlSearchParams.get("isMobile") !== "y") {
        mutedOtherBoxes(whichBox)
    }
    //------------------------------
    
    var lastActiveBox = activeBox;
    if( activeBox >= 0 ) {
        collapseToThumbHelper();
    }
    if( lastActiveBox != whichBox) {
        var id = getIdOfBox(whichBox);
        activeBox = whichBox;
        setReshaper(id, reshapeToFullSize);
        document.getElementById(id).style.zIndex = 1;
        if( whichBox > 0) {
            document.getElementById('muteButton').style.display = "block";
            updateMuteImage();
            //document.getElementById('killButton').style.display = "block";
            document.getElementById('killButton').style.display = "none";
        }
    }
    updateMuteImage(false);
    handleWindowResize();
}

function prepVideoBox(whichBox) {
    var id = getIdOfBox(whichBox);
    setReshaper(id, reshapeThumbs[whichBox]);
    document.getElementById(id).onclick = function() {
        expandThumb(whichBox);
    };
}


function killActiveBox() {
    if( activeBox > 0) {
        var easyrtcid = easyrtc.getIthCaller(activeBox-1);
        collapseToThumb();
        setTimeout( function() {
            easyrtc.hangup(easyrtcid);
        }, 400);
    }
}


function muteActiveBox() {
    updateMuteImage(true);
}

var IsCallEverybodyElseFireTime = true;

function callEverybodyElse(roomName, otherPeople) {
    document.getElementById("roomname").innerHTML = "Room: " + roomName;

    showUserList(otherPeople);
    
    //easyrtc.setRoomOccupantListener(null); // so we're only called once.

    if (IsCallEverybodyElseFireTime === false) {
        return;
    }

    IsCallEverybodyElseFireTime = false;


    var list = [];
    var connectCount = 0;
    for(var easyrtcid in otherPeople ) {
        list.push(easyrtcid);
    }
    //
    // Connect in reverse order. Latter arriving people are more likely to have
    // empty slots.
    //
    function establishConnection(position) {
        function callSuccess() {
            connectCount++;
            if( connectCount < maxCALLERS && position > 0) {
                establishConnection(position-1);
            }
        }
        function callFailure(errorCode, errorText) {
            easyrtc.showError(errorCode, errorText);
            if( connectCount < maxCALLERS && position > 0) {
                establishConnection(position-1);
            }
        }
        easyrtc.call(list[position], callSuccess, callFailure);

    }
    if( list.length > 0) {
        establishConnection(list.length-1);
    }
}


function loginSuccess(easyrtcid) {
    expandThumb(0);  // expand the mirror image initially.

    if (easyrtc.username == null) {
        document.getElementById("iam").innerHTML = "I am \"" + easyrtc.cleanId(easyrtcid) + "\".";
    } else {
        document.getElementById("iam").innerHTML = "I am "  + easyrtc.username + ".";
    }
    document.getElementById("startRecording").disabled = false;
}


function cancelText() {
    document.getElementById('textentryBox').style.display = "none";
    document.getElementById('textEntryButton').style.display = "block";
}


function sendText(e) {
    document.getElementById('textentryBox').style.display = "none";
    document.getElementById('textEntryButton').style.display = "block";
    var stringToSend = document.getElementById('textentryField').value;
    if( stringToSend && stringToSend != "") {
        for(var i = 0; i < maxCALLERS; i++ ) {
            var easyrtcid = easyrtc.getIthCaller(i);
            if( easyrtcid && easyrtcid != "") {
                easyrtc.sendPeerMessage(easyrtcid, "im",  stringToSend);
            }
        }
    }
    return false;
}


function showTextEntry() {
    document.getElementById('textentryField').value = "";
    document.getElementById('textentryBox').style.display = "block";
    document.getElementById('textEntryButton').style.display = "none";
    document.getElementById('textentryField').focus();
}


function showMessage(startX, startY, content) {
    var fullPage = document.getElementById('fullpage');
    var fullW = parseInt(fullPage.offsetWidth);
    var fullH = parseInt(fullPage.offsetHeight);
    var centerEndX = .2*startX + .8*fullW/2;
    var centerEndY = .2*startY + .8*fullH/2;


    var cloudObject = document.createElement("img");
    cloudObject.src = "images/cloud.png";
    cloudObject.style.width = "1px";
    cloudObject.style.height = "1px";
    cloudObject.style.left = startX + "px";
    cloudObject.style.top = startY + "px";
    fullPage.appendChild(cloudObject);

    cloudObject.onload = function() {
        cloudObject.style.left = startX + "px";
        cloudObject.style.top = startY + "px";
        cloudObject.style.width = "4px";
        cloudObject.style.height = "4px";
        cloudObject.style.opacity = 0.7;
        cloudObject.style.zIndex = 5;
        cloudObject.className = "transit boxCommon";
        var textObject;
        function removeCloud() {
            if( textObject) {
                fullPage.removeChild(textObject);
                fullPage.removeChild(cloudObject);
            }
        }
        setTimeout(function() {
            cloudObject.style.left = centerEndX - fullW/4 + "px";
            cloudObject.style.top = centerEndY - fullH/4+ "px";
            cloudObject.style.width = (fullW/2) + "px";
            cloudObject.style.height = (fullH/2) + "px";
        }, 10);
        setTimeout(function() {
            textObject = document.createElement('div');
            textObject.className = "boxCommon";
            textObject.style.left = Math.floor(centerEndX-fullW/8) + "px";
            textObject.style.top = Math.floor(centerEndY) + "px";
            textObject.style.fontSize = "16pt";
            textObject.style.width = (fullW*.4) + "px";
            textObject.style.height = (fullH*.4) + "px";
            textObject.style.zIndex = 6;
            textObject.appendChild( document.createTextNode(content));
            fullPage.appendChild(textObject);
            textObject.onclick = removeCloud;
            cloudObject.onclick = removeCloud;
        }, 1000);
        setTimeout(function() {
            cloudObject.style.left = startX + "px";
            cloudObject.style.top = startY + "px";
            cloudObject.style.width = "4px";
            cloudObject.style.height = "4px";
            fullPage.removeChild(textObject);
        }, 9000);
        setTimeout(function(){
            fullPage.removeChild(cloudObject);
        }, 10000);
    }
}

function messageListener(easyrtcid, msgType, content) {
    console.log(easyrtc.idToName(easyrtcid));

    for(var i = 0; i < maxCALLERS; i++) {
        if( easyrtc.getIthCaller(i) == easyrtcid) {
            var startArea = document.getElementById(getIdOfBox(i+1));
            var startX = parseInt(startArea.offsetLeft) + parseInt(startArea.offsetWidth)/2;
            var startY = parseInt(startArea.offsetTop) + parseInt(startArea.offsetHeight)/2;
            let msg = easyrtc.idToName(easyrtcid) + ": " + content;
            showMessage(startX, startY, msg);
        }
    }
}

var currentTextTracks = [];
var muteCheckboxIds = {};

function appInit() {

    // Prep for the top-down layout manager
    setReshaper('fullpage', reshapeFull);
    for(var i = 0; i < numVideoOBJS; i++) {
        prepVideoBox(i);
    }
    setReshaper('killButton', killButtonReshaper);
    setReshaper('muteButton', muteButtonReshaper);
    setReshaper('textentryBox', reshapeTextEntryBox);
    setReshaper('textentryField', reshapeTextEntryField);
    setReshaper('textEntryButton', reshapeTextEntryButton);

    //
    if (urlSearchParams.get("isMobile") == "y") {
        if (urlSearchParams.get("os") !== "android") {
            setReshaper('mobileMap', reshapeMobileMap);
            setReshaper('mobileControlsPanel', reshapeMobileControlsPanel);
        }
    }


    updateMuteImage(false);
    window.onresize = handleWindowResize;
    handleWindowResize(); //initial call of the top-down layout manager


    // user name
    if (urlSearchParams.get("user") != null) {
        easyrtc.setUsername(urlSearchParams.get("user"));        
    }

    // room
    if (urlSearchParams.get("room") != null) {
        easyrtc.joinRoom(urlSearchParams.get("room"), null, null, null);
    }

    // is mobile
    if (urlSearchParams.get("isMobile") == "y") {
        document.getElementById("controlBlock").style.display = 'none';
        if (urlSearchParams.get("os") !== "android") {
            document.getElementById("mobileControlBlock").style.visibility = "visible";
        }
    } else {
        document.getElementById("controlBlock").style.visibility = "visible";
    }


    // support record?
    if( !easyrtc.supportsRecording()) {
        document.getElementById("recordButtons").style.display = 'none';
     } else {
         if( easyrtc.isRecordingTypeSupported("h264")) document.getElementById("useH264").disabled = false;
         if( easyrtc.isRecordingTypeSupported("vp9")) document.getElementById("useVP9").disabled = false;
         if( easyrtc.isRecordingTypeSupported("vp8")) document.getElementById("useVP8").disabled = false;
     }


    easyrtc.setRoomOccupantListener(callEverybodyElse);
    easyrtc.easyApp("easyrtc.multiparty", "box0", ["box1", "box2", "box3"], loginSuccess);
    easyrtc.setPeerListener(messageListener);
    easyrtc.setDisconnectListener( function() {
        easyrtc.showError("LOST-CONNECTION", "Lost connection to signaling server");
    });
    easyrtc.setOnCall( function(easyrtcid, slot) {
        //-- mobile: --
        if (urlSearchParams.get("isMobile") == "y") {
            let username = easyrtc.idToName(easyrtcid).toLowerCase();
            if (username !== "master") {
                setTimeout( function() {
                    easyrtc.hangup(easyrtcid);
                }, 100);
                return;
            }            
        }
        //-------------

        boxUsed[slot+1] = true;
        if(activeBox == 0 ) { // first connection
            collapseToThumb();
            document.getElementById('textEntryButton').style.display = 'block';
        }
        document.getElementById(getIdOfBox(slot+1)).style.visibility = "visible";

        //------
        let video = document.getElementById(getIdOfBox(slot+1));
        let userName = " " + easyrtc.idToName(easyrtcid) + " ";

        if (currentTextTracks[slot]) {
            let currentTextTrack = currentTextTracks[slot];
            let currentCue = currentTextTrack.cues[0];
            currentTextTrack.removeCue(currentCue);
            currentTextTrack.addCue(new VTTCue(0, Number.MAX_SAFE_INTEGER, userName));
        } else {
            let newTextTrack = video.addTextTrack("captions", "sample");
            newTextTrack.mode = "showing";
            newTextTrack.addCue(new VTTCue(0, Number.MAX_SAFE_INTEGER, userName));
            currentTextTracks[slot] = newTextTrack;
        }
        //------

        handleWindowResize();

        console.log("getConnection count="  + easyrtc.getConnectionCount() ); 

        muteCheckboxIds[getIdOfBox(slot+1)] = easyrtcid;

        // android:
        if (urlSearchParams.get("os") == "android") {
            B4A.CallSub('allMutedChange', true);
        }
    });

    easyrtc.setOnHangup(function(easyrtcid, slot) {
        boxUsed[slot+1] = false;
        if(activeBox > 0 && slot+1 == activeBox) {
            collapseToThumb();
        }

        setTimeout(function() {
            document.getElementById(getIdOfBox(slot+1)).style.visibility = "hidden";
            document.getElementById(getIdOfBox(slot+1)).muted = false;

            // android:
            if (urlSearchParams.get("os") == "android") {
                B4A.CallSub('allMutedChange', true);
            }

            if( easyrtc.getConnectionCount() == 0 ) { // no more connections
                expandThumb(0);
                document.getElementById('textEntryButton').style.display = 'none';
                document.getElementById('textentryBox').style.display = 'none';
            }
            handleWindowResize();

            console.log("getConnection count="  + easyrtc.getConnectionCount() );

            muteCheckboxIds[getIdOfBox(slot+1)] = "";
        },20);
    });
}

//----------------------------------------------------------------//

var personMap = null;

function initMap() {
    
    if (urlSearchParams.get("isMobile") == "y") {  // is mobile
        if (urlSearchParams.get("os") === "android") {
            return;
        }
        else {
            let uluru = {lat: 25.0782782, lng: 121.537494};
            let myMap = document.getElementById('mobileMap');

            personMap = new google.maps.Map(myMap, {
                zoom: 15,
                center: uluru
            });
        }
    }
    else {  // Desktop Map
        let uluru = {lat: 25.0782782, lng: 121.537494};
        let myMap = document.getElementById('map');
        personMap = new google.maps.Map(myMap, {
            zoom: 15,
            center: uluru
        });
    }

    if ("geolocation" in navigator) {
        //geolocation is available
        navigator.geolocation.getCurrentPosition(function(position) {
            let center = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            personMap.setCenter(center)

            // let marker = new google.maps.Marker({
            //     position: center,
            //     title: "123456",
            //     label: {text: "My Location", color: "#5151A2",  fontSize: "16px", fontWeight: "bold"},
            //     icon: "images/marker-s.png",
            //     map: personMap
            // });
            // markerArray.push(marker);
        });
    }
}

var myCurrentLocation = null;

function gotoMyLocation() {
    let center = new google.maps.LatLng(myCurrentLocation.coords.latitude, myCurrentLocation.coords.longitude);
    personMap.panTo(center);
}

function updateMyPosition(position) {
    console.log(position.coords.latitude + ", " + position.coords.longitude);
    myCurrentLocation = position;
}


function clearConnectList() {
    var otherClientDiv = document.getElementById('otherClients');
    while (otherClientDiv.hasChildNodes()) {
        otherClientDiv.removeChild(otherClientDiv.lastChild);
    }

    var mutedUsersDiv = document.getElementById('mutedUsers');
    while (mutedUsersDiv.hasChildNodes()) {
        mutedUsersDiv.removeChild(mutedUsersDiv.lastChild);
    }
}

function showUserList(otherPeople) {
    clearConnectList();

    let otherClientDiv = document.getElementById('otherClients');

    for(let easyrtcid in otherPeople) {
        let button = document.createElement('button');
        button.onclick = function(easyrtcid) {
            return function() {
                performCall(easyrtcid);
            };
        }(easyrtcid);

        let label = document.createTextNode(easyrtc.idToName(easyrtcid));
        button.appendChild(label);
        otherClientDiv.appendChild(button);

        let br = document.createElement("br");
        otherClientDiv.appendChild(br);
    }

    let mutedUsersDiv = document.getElementById('mutedUsers');

    for(let easyrtcid in otherPeople) {
        let checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.name = easyrtcid;
        checkbox.className = "mutedCheckbox";
        checkbox.id = "checkbox_" + easyrtcid;

        checkbox.onchange = function(e, easyrtcid) {
            return function() {
                performMutedCall(easyrtcid, e.checked);
            };
        }(checkbox, easyrtcid);
        
        let pNode = document.createElement('p');
        let label = document.createTextNode(easyrtc.idToName(easyrtcid));
        pNode.appendChild(checkbox);
        pNode.appendChild(label);

        mutedUsersDiv.appendChild(pNode);        
    }
}

function performCall(otherEasyrtcid) {
    let slot = easyrtc.getSlotOfCaller(otherEasyrtcid);
    console.log(slot);
    expandThumb(slot+1);
}

function performMutedCall(otherEasyrtcid, isMuted) {
    let slot = easyrtc.getSlotOfCaller(otherEasyrtcid);
    let videoObject = document.getElementById(getIdOfBox(slot+1));
    videoObject.muted = isMuted;
    updateMuteImage(false);
}

function mutedOtherBoxes(whichBox) {
    for (let key in muteCheckboxIds) {
        if (muteCheckboxIds[key]) {
            let videoObject = document.getElementById(key);
            let muteCheckbox = document.getElementById( "checkbox_" + muteCheckboxIds[key] );
    
            if (key == getIdOfBox(whichBox)) {
                videoObject.muted = false;
                if (muteCheckbox) {
                    muteCheckbox.checked = false;
                }
            } else {
                videoObject.muted = true;
                if (muteCheckbox) {
                    muteCheckbox.checked = true;
                }
            }

            // android:
            if (urlSearchParams.get("os") == "android") {
                B4A.CallSub('allMutedChange', true);
            }
        }
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

                // android:
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

function openVideoManagerButton_click() {
    let win = window.open('playRecordFile.html', '_blank');
    win.focus();
}

function showMobileMapButton_click() {
    if (document.getElementById('mobileMap').style.display === 'none'){
        document.getElementById('mobileMap').style.display = "block";
        document.getElementById('showMobileMapButton').innerText = "Hide Map";
    } else {
        document.getElementById('mobileMap').style.display = "none";
        document.getElementById('showMobileMapButton').innerText = "Show Map";
    }
}

function showMobileControlsButton_click() {
    if (document.getElementById('mobileControlsPanel').style.display === 'none'){
        document.getElementById('mobileControlsPanel').style.display = "block";
    }
}

function closeMobileControlsButton_click() {
    document.getElementById('mobileControlsPanel').style.display = "none";
}


//--- Android Use: ---
function allBoxesMuted(isMuted) {
    for (let key in muteCheckboxIds) {
        let videoObject = document.getElementById(key);

        if (isMuted == true) {
            videoObject.muted = true;
        } else {
            videoObject.muted = false;
        }
        
        updateMuteImage(false);
    }
}
//--------------------


var selfRecorder = null;
var caller1Recorder = null;
var caller2Recorder = null;
var caller3Recorder = null;

function startRecording() {
    let nowdate = new Date().toLocaleDateString().replace(/\//g, '-');
    let nowtime = new Date().toLocaleTimeString('en-US', { hour12: false, 
                                                           hour: "numeric", 
                                                           minute: "numeric",
                                                           second: "numeric" });
    let timeStr = nowdate + "_" + nowtime;
    //console.log(timeStr);

    var selfLink = document.getElementById("selfDownloadLink");
    selfLink.innerText = "";

    // self video
    selfRecorder = easyrtc.recordToFile( easyrtc.getLocalStream(), 
               selfLink, ("self_" + timeStr) );
    if( selfRecorder ) {
       document.getElementById("startRecording").disabled = true;
       document.getElementById("stopRecording").disabled = false;
    } else {
       window.alert("failed to start recorder for self");
       return;
    }

    // caller 1 video
    var caller1Link = document.getElementById("caller1DownloadLink");
    caller1Link.innerText = "";

    if( easyrtc.getIthCaller(0)) {
       caller1Recorder = easyrtc.recordToFile(
           easyrtc.getRemoteStream(easyrtc.getIthCaller(0), null), 
             caller1Link, ("caller1_" + timeStr) );
       if( !caller1Recorder ) {
          window.alert("failed to start recorder for caller 1");
       }
    } else {
       caller1Recorder = null;
    }

    // caller 2 video
    var caller2Link = document.getElementById("caller2DownloadLink");
    caller2Link.innerText = "";

    if( easyrtc.getIthCaller(1)) {
       caller2Recorder = easyrtc.recordToFile(
           easyrtc.getRemoteStream(easyrtc.getIthCaller(1), null), 
             caller2Link, ("caller2_" + timeStr) );
       if( !caller2Recorder ) {
          window.alert("failed to start recorder for caller 2");
       }
    } else {
       caller2Recorder = null;
    }

    // caller 3 video
    var caller3Link = document.getElementById("caller3DownloadLink");
    caller3Link.innerText = "";

    if( easyrtc.getIthCaller(2)) {
       caller3Recorder = easyrtc.recordToFile(
           easyrtc.getRemoteStream(easyrtc.getIthCaller(2), null), 
             caller3Link, ("caller3_" + timeStr) );
       if( !caller3Recorder ) {
          window.alert("failed to start recorder for caller 3");
       }
    } else {
       caller3Recorder = null;
    }
}

function endRecording() {
    if( selfRecorder ) {
       selfRecorder.stop();
    }
    if( caller1Recorder ) {
       caller1Recorder.stop();
    }
    if( caller2Recorder ) {
        caller2Recorder.stop();
    }
    if( caller3Recorder ) {
        caller3Recorder.stop();
    }
    document.getElementById("startRecording").disabled = false;
    document.getElementById("stopRecording").disabled = true;
}

