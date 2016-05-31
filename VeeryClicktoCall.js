/**
 * Created by Pawan on 5/26/2016.
 */
/**
 * Created by Pawan on 5/25/2016.
 */

var sipStack;
var callSession;


var readyCallback = function(e) {
    // function called when sipml is successfully initialised.
    createSipStack(); // calling this function to create sip stack(see below)
};

var errorCallback = function(e) {
    // function called when error occured during sipml initialisation.
    console.log("Initiation error "+e);
};


SIPml.init(readyCallback, errorCallback);

/*
 document.write(
 "<button id='c2c_btn_call'  onclick='clickTocall()' style='background-color: transparent;position:fixed; z-index:98; top: 35%; right: 0px;  -moz-transform: rotate(-90deg); '><img id='veeryImg' src='sss.svg' width='40px' height='40px'/></button>"
 );
 */

document.write(
    "<a href='#'  id='c2c_btn_call_2' onclick='clickTocall()' style='position:fixed; z-index:98; top: 35%; right: 0px; -moz-transform: rotate(-90deg);background-image:url('veery_callus.svg')' disabled><img id='veeryImg' class= 'veerybird' src='img/veery_callus.svg' width='70px' height='70px'/></a>"
);




function EventListener(e) {

    /*
     * e.type ;type of event listener
     * e.session ; current event session
     * e.getSipResponseCode() ; event response code
     * e.description ; event description
     */

    if(e.type == 'started'){
        // successfully started the stack.
        // register();

        //alert(e.type);
    } if(e.type == 'stopped'){
        // successfully started the stack.
        // register();
        document.getElementById('veeryImg').src="img/veery_callus.svg";
        callSession = null;

        //alert(e.type);
    } else if(e.type == 'i_new_call'){
        // when new incoming call comes.
        // incoming call Id ; e.newSession.getRemoteFriendlyName()

        if(callSession || incomingCallSession) {


            e.newSession.hangup(); // hanging up new call when caller is in another outgoing call.

        } else {

            e.newSession.getRemoteFriendlyName();
            incomingCallSession = e.newSession;
            incomingCallSession.setConfiguration({
                audio_remote: document.getElementById('audio_remote'),
                video_remote:document.getElementById('video-remote'),
                video_local:document.getElementById('audio-remote'),
                events_listener: { events: '*', listener: EventListener }
            });
            acceptCall(); // accepts call

        }
    } else if(e.type == 'connecting') {

         if(e.session == callSession) {
            // connecting outgoing call.
            document.getElementById('veeryImg').src="img/veery_ringing.svg";
        } else if(e.session == incomingCallSession) {
            // connecting incoming call.
        }

    } else if(e.type == 'connected') {

        /*if(e.session == registerSession) {
         // successfully registed.
         } else*/ if(e.session == callSession) {
            // successfully connected call
            document.getElementById('veeryImg').src="img/veery_connected.svg";

        }

    } else if(e.type == 'terminated') {

        /*
         * e.getSipResponseCode()=603 ; call declined without any answer
         * e.getSipResponseCode()=487 ; caller terminated the call
         * e.getSipResponseCode()=-1 ; call answered and hanguped by caller/callee
         * e.getSipResponseCode()=200 ; user unregistered
         */

        /*if(e.session == registerSession) {
         // client unregistered
         } else*/ if(e.session == callSession) {

            document.getElementById('veeryImg').src="img/veery_callus.svg";
            callSession = null;

            //outgoing call terminated.
        }

    }
}

function createSipStack() {
    sipStack = new SIPml.Stack({
        realm: 'DuoSoftware.com', // mandatory domain name
        impi: 'test', // mandatory authorisation name
        impu: 'sip:Veery@DuoSoftware.com', // mandatory sip uri
        password: 'password', //optional
        display_name: ' Veery.io', // optional
        websocket_proxy_url: getWebSocketUrl(), // optional
        outbound_proxy_url: '', // optional
        enable_rtcweb_breaker: true, // optional
        events_listener: { events: '*', listener: EventListener } /* optional , '*' means all events */
    });

    sipStack.start(); // starting sip stack
}

function makeCall(ext) {
    callSession = sipStack.newSession('call-audio', {
        /* audio and video will not be played if you didnt give values to audio_remote,video_remote and for video_local. */
        audio_remote: document.getElementById('audio_remote'),
        events_listener: { events: '*', listener: EventListener }
    });
    //callSession.call("clicktocall_1_3_9999");
    callSession.call(ext);
}

function hangupCall() { // call this function to hangup /reject a call.
    document.getElementById('veeryImg').src="img/veery_callus.svg";
    if(callSession) {
        callSession.hangup(); // hangups outgoing call.
        //callSession==null;
    }
}

function clickTocall()
{

    if(!callSession)
    {
        //alert("No session");
        makeCall(getDestination());
    }
    else
    {
        //alert("session");
        hangupCall()
    }
}