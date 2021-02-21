const connOptions = {
    hosts: {
        domain: 'jitsi.expertcollege.com',
        muc: 'conference.jitsi.expertcollege.com' // FIXME: use XEP-0030
    },
    bosh: '//jitsi.expertcollege.com/http-bind', // FIXME: use xep-0156 for that
    websocket: 'wss://jitsi.expertcollege.com/xmpp-websocket',
    // The name of client node advertised in XEP-0115 'c' stanza
    clientNode: 'http://jitsi.org/jitsimeet',
    resolution: 1080,
    constraints: {
         video: {
             height: {
                 ideal: 1080,
                 max: 1080,
                 min: 240
             }
         }
     }
};

const initOptions = {
    disableAudioLevels: true
};

const confOptions = {
    openBridgeChannel: true
};
