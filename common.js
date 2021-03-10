//domain
const JITSI_DOMAIN = 'onprem-jitsi.expertcollege.com'; 

const connOptions = {
    hosts: {
        domain: JITSI_DOMAIN,
        muc: `conference.${JITSI_DOMAIN}`
    },
    bosh: `//${JITSI_DOMAIN}/http-bind`, 
    websocket: `wss://${JITSI_DOMAIN}/xmpp-websocket`,

    // The name of client node advertised in XEP-0115 'c' stanza
    clientNode: 'http://jitsi.org/jitsimeet'
};


const initOptions = {
};

const confOptions = {
    openBridgeChannel: true
};


//display name pre- and suffix
const TEACHER_PREFIX = 't/';
const ER_PREFIX = 'er/';
const VIDEOSCREEN_SUFFIX = '/video';
const CONSOLE_SUFFIX = '/console';
const PRESENTATION_SUFFIX = '/presentation';
const TABLET_SUFFIX = '/tablet';

//meeting suffix (Jitsi only allows one video feed per user per meeting, so we use seperate meetings for video & desktopsharing)
const VIDEO_MEETING_SUFFIX = '-video';
const DESKTOP_MEETING_SUFFIX = '-desktop';


//rooms
const ROOM_LOBBY = 'lobby';

//commands
const CMD_JOIN_ROOM = 'join-room';



	
//resolutions
const RES_THUMBNAIL = 240;
const RES_FULLHD = 2160;


