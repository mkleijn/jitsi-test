/* global $, JitsiMeetJS */

const options = {
    hosts: {
        domain: 'jitsi.expertcollege.com',
        muc: 'conference.jitsi.expertcollege.com' // FIXME: use XEP-0030
    },
    bosh: '//jitsi.expertcollege.com/http-bind', // FIXME: use xep-0156 for that

    // The name of client node advertised in XEP-0115 'c' stanza
    clientNode: 'http://jitsi.org/jitsimeet'
};

const confOptions = {
    openBridgeChannel: true
};

let connection = null;
let isJoined = false;
let room = null;
let lobby = null;

let localTracks = [];
const remoteTracks = {};

let params = new URLSearchParams(location.search);

/**
 * Handles local tracks.
 * @param tracks Array with JitsiTrack objects
 */
function onLocalTracks(tracks) {
    localTracks = tracks;
    for (let i = 0; i < localTracks.length; i++) {
        localTracks[i].addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED, audioLevel => console.log(`Audio Level local: ${audioLevel}`));
        localTracks[i].addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, () => console.log('local track muted'));
        localTracks[i].addEventListener(JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, () => console.log('local track stoped'));
        localTracks[i].addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED, deviceId => console.log(`track audio output device was changed to ${deviceId}`));
        
        if (localTracks[i].getType() === 'video') {
            $('body').append(`<video autoplay='1' id='localVideo${i}' />`);
            localTracks[i].attach($(`#localVideo${i}`)[0]);
        } else {
            $('body').append(
                `<audio autoplay='1' muted='true' id='localAudio${i}' />`);
            localTracks[i].attach($(`#localAudio${i}`)[0]);
        }
        if (isJoined) {
            room.addTrack(localTracks[i]);
        }
    }
}

function onRemoteTrackRemoved(track) {
}

/**
 * Handles remote tracks
 * @param track JitsiTrack object
 */
function onRemoteTrackAdded(track) {
    if (track.isLocal()) {
        return;
    }
    const participant = track.getParticipantId();

    if (!remoteTracks[participant]) {
        remoteTracks[participant] = [];
    }
    const idx = remoteTracks[participant].push(track);

    track.addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED, audioLevel => console.log(`Audio Level remote: ${audioLevel}`));
    track.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED,() => console.log('remote track muted'));
    track.addEventListener(JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, () => console.log('remote track stoped'));
    track.addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED, deviceId => console.log(`track audio output device was changed to ${deviceId}`));
    
    const id = participant + track.getType() + idx;

    if (track.getType() === 'video') {
        $('body').append(
            `<video autoplay='1' id='${participant}video${idx}' />`);
    } else {
        $('body').append(
            `<audio autoplay='1' id='${participant}audio${idx}' />`);
    }
    track.attach($(`#${id}`)[0]);
}

/**
 * That function is executed when the conference is joined
 */
function onConferenceJoined() {
    console.log('conference joined!');
    isJoined = true;
    for (let i = 0; i < localTracks.length; i++) {
        room.addTrack(localTracks[i]);
    }
}

function onUserJoined(id, user) {
    console.log('user join');
    remoteTracks[id] = [];
}

/**
 *
 * @param id
 */
function onUserLeft(id) {
    console.log('user left');
    if (!remoteTracks[id]) {
        return;
    }
    const tracks = remoteTracks[id];

    for (let i = 0; i < tracks.length; i++) {
        tracks[i].detach($(`#${id}${tracks[i].getType()}`));
    }
}

/**
 * That function is called when connection is established successfully
 */
function onConnectionSuccess() {
    lobby = connection.initJitsiConference('lobby', confOptions);
    lobby.on(JitsiMeetJS.events.conference.ENDPOINT_MESSAGE_RECEIVED, (from, message) => {
         if (message && message.command == 'join-room') {
            if (room) {
                room.leave().then(_ => {
                    isJoined = false;
                    joinRoom(message.values.room); 
                });
            } else {
                joinRoom(message.values.room);
            }
         }
    });
    if (params.has('name')) {
        lobby.setDisplayName(params.get('name'));
    }
    lobby.join();    
}

function joinRoom(name) {
    room = connection.initJitsiConference(name, confOptions);
    room.on(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrackAdded);
    room.on(JitsiMeetJS.events.conference.TRACK_REMOVED, onRemoteTrackRemoved);
    room.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, onConferenceJoined);
    room.on(JitsiMeetJS.events.conference.USER_JOINED, onUserJoined);
    room.on(JitsiMeetJS.events.conference.USER_LEFT, onUserLeft);
    room.on(JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED, (userID, displayName) => console.log(`${userID} - ${displayName}`));

    if (params.has('name')) {
        room.setDisplayName(params.get('name'));
    }
    room.join();
   
}

/**
 * This function is called when the connection fail.
 */
function onConnectionFailed() {
    console.error('Connection Failed!');
}

/**
 * This function is called when the connection fail.
 */
function onDeviceListChanged(devices) {
    console.info('current devices', devices);
}

/**
 * This function is called when we disconnect.
 */
function disconnect() {
    console.log('disconnect!');
    connection.removeEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
    connection.removeEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, onConnectionFailed);
    connection.removeEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, disconnect);
}

/**
 *
 */
function unload() {
    for (let i = 0; i < localTracks.length; i++) {
        localTracks[i].dispose();
    }
    if (room) room.leave();
    if (lobby) lobby.leave();
    if (connection) connection.disconnect();
}


$(window).bind('beforeunload', unload);
$(window).bind('unload', unload);

// JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
const initOptions = {
    disableAudioLevels: true
};

JitsiMeetJS.init(initOptions);

connection = new JitsiMeetJS.JitsiConnection(null, null, options);

connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, onConnectionFailed);
connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, disconnect);

JitsiMeetJS.mediaDevices.addEventListener(JitsiMeetJS.events.mediaDevices.DEVICE_LIST_CHANGED, onDeviceListChanged);

connection.connect();

JitsiMeetJS.createLocalTracks({ devices: [ 'audio', 'video', 'desktop' ] })
    .then(onLocalTracks)
    .catch(error => {
        throw error;
    });

if (JitsiMeetJS.mediaDevices.isDeviceChangeAvailable('output')) {
    JitsiMeetJS.mediaDevices.enumerateDevices(devices => {
        const audioOutputDevices
            = devices.filter(d => d.kind === 'audiooutput');

        if (audioOutputDevices.length > 1) {
            $('#audioOutputSelect').html(
                audioOutputDevices
                    .map(
                        d =>
                            `<option value="${d.deviceId}">${d.label}</option>`)
                    .join('\n'));

            $('#audioOutputSelectWrapper').show();
        }
    });
}
