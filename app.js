const express = require('express'); //added
const port = process.env.PORT || 3000; //added
const app = express(); //added
const SessionWare = require('botmaster-session-ware');
const WatsonConversationWare = require('botmaster-watson-conversation-ware');
const incomingMiddleware = require('./middleware/incoming');


// Routing for index.html
app.use(express.static(__dirname + '/public')); //added

const server = app.listen(port, '0.0.0.0', () => {  //added
    console.log('Server listening at port %d', port);
});

const Botmaster = require('botmaster');
const SocketioBot = require('botmaster-socket.io');

const botmaster = new Botmaster({
  server,
});

const socketioSettings = {
  id: 'WILSON',
  server,
};

const socketioBot = new SocketioBot(socketioSettings);
botmaster.addBot(socketioBot);

const watsonConversationWareOptions = {
  settings: {
    username: '4a687743-9ca2-42f6-8152-626f7c98e758',
    password: 'iFS3ZoHoBJmo',
    version: 'v1', // as of this writing (01 Apr 2017), only v1 is available
    version_date: '2017-02-03', // latest version-date as of this writing
  },
  workspaceId: '631fb3da-f8b2-4896-b4a2-6c1c9c7bf1d6' // As provided by Watson Conversation
}

// declaring middleware
const watsonConversationWare = WatsonConversationWare(watsonConversationWareOptions);
botmaster.use(watsonConversationWare);
botmaster.use(incomingMiddleware.tone.addToneInfoToUpdate);
botmaster.use(incomingMiddleware.weather.addWeatherInfoToUpdate);
botmaster.use(incomingMiddleware.stock.addStockInfoToUpdate);
botmaster.use(incomingMiddleware.fundinfo.addMFInfoToUpdate);
botmaster.use(incomingMiddleware.railfareinfo.addRailFareInfoToUpdate);
botmaster.use(incomingMiddleware.railseatinfo.addSeatInfoToUpdate);
botmaster.use(incomingMiddleware.railpnrstatus.addPnrInfoToUpdate);
botmaster.use(incomingMiddleware.fxinfo.addfxInfoToUpdate);
botmaster.use(incomingMiddleware.bankproducts.addbankproductInfoToUpdate);
botmaster.use(incomingMiddleware.discovery.addDiscoveryInfoToUpdate);


botmaster.use(incomingMiddleware.reply.replyToUser);



// This will make our context persist throughout different messages from the
// same user
const sessionWare = new SessionWare();
botmaster.useWrapped(sessionWare.incoming, sessionWare.outgoing);

botmaster.on('error', (bot, err) => { // added
  console.log(err.stack); // added
}); // added