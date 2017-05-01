'use strict'

const mumble = require('mumble')
const speaker = require('speaker')
const fs = require('fs')
const stream = require('stream') 
const irc = require('irc')
const rivets = require('rivets')

let urlField = document.getElementById('URL')
let portField = document.getElementById('Port')
let usernameField = document.getElementById('Username')
let connectButton = document.getElementById('ConnectButton')
let templates = new Array()

let audioOutput = new speaker({
      channels: 1,
      bitDepth: 16,
      sampleRate: 48000
});

let options = {
    key: fs.readFileSync( 'key.pem' ),
    cert: fs.readFileSync( 'cert.pem' )
};

rivets.components['channel-tag'] = {
    // Return the template for the component.
    template: function() {
        return fs.readFileSync('views/templates/channel-tag.html', 'utf8', (err, buffer) => {  return buffer; });
    },

    // Takes the original element and the data that was passed into the
    // component (either from rivets.init or the attributes on the component
    // element in the template).
    initialize: function(el, data) {
        return data;
    }
}

connectButton.addEventListener('click', () => {
    let mConnection = mumble.connect( urlField.value + ':' + portField.value, options, function ( error, connection ) { 
        if( error ) { throw new Error( error ); }

        connection.authenticate(usernameField.value);

        connection.on( 'initialized', () => {
            console.log( 'Connection initialized' );

            console.log(connection);
            rivets.init('channel-tag', document.querySelector('#ChannelList'), { channel: connection.rootChannel });
        });

        connection.on( 'voice', ( voice ) => {
            audioOutput.write(voice)
        });

    })
})