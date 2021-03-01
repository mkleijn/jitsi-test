const connOptions = {
    hosts: {
        domain: 'jitsi.expertcollege.com',
        muc: 'conference.jitsi.expertcollege.com' // FIXME: use XEP-0030
    },
    bosh: '//jitsi.expertcollege.com/http-bind', // FIXME: use xep-0156 for that
    //websocket: 'wss://jitsi.expertcollege.com/xmpp-websocket',
    // The name of client node advertised in XEP-0115 'c' stanza
    clientNode: 'http://jitsi.org/jitsimeet'
};

const interfaceOptions = {
    APP_NAME: 'eXperienceroom',
    DEFAULT_BACKGROUND: '#2ea3f2',
    DEFAULT_LOCAL_DISPLAY_NAME: 'me',
    DEFAULT_LOGO_URL: '',
    DEFAULT_REMOTE_DISPLAY_NAME: '',
    DEFAULT_WELCOME_PAGE_LOGO_URL: '',
    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
    
};

const initOptions = {
    disableAudioLevels: false,
    disableSimulcast: true,
    enableAnalyticsLogging: true
};

const confOptions = {
    openBridgeChannel: true
};


//display name pre- and suffix
const TEACHER_PREFIX = 'teacher/';
const ER_PREFIX = 'experienceroom/';
const VIDEOSCREEN_SUFFIX = '/video';
const CONSOLE_SUFFIX = '/console';
const PRESENTATION_SUFFIX = '/presentation';
const TABLET_SUFFIX = '/tablet';

//rooms
const ROOM_LOBBY = 'lobby';

//commands
const CMD_JOIN_ROOM = 'join-room';



	
//resolutions
const RES_THUMBNAIL = 180;
const RES_FULLHD = 1080;

//domain
JITSI_DOMAIN = 'jitsi.expertcollege.com'; 
