const connOptions = {
    hosts: {
        domain: 'jitsi.expertcollege.com',
        muc: 'conference.jitsi.expertcollege.com' // FIXME: use XEP-0030
    },
    //bosh: '//jitsi.expertcollege.com/http-bind', // FIXME: use xep-0156 for that
    websocket: 'wss://jitsi.expertcollege.com/xmpp-websocket',
    // The name of client node advertised in XEP-0115 'c' stanza
    clientNode: 'http://jitsi.org/jitsimeet'
};

const initOptions = {
    disableAudioLevels: true
};

const confOptions = {
    openBridgeChannel: true
};
