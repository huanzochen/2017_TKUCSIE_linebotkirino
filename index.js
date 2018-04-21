const linebot = require('linebot');
const express = require('express');
const rp = require('request-promise');

const bot = linebot({
	channelId: process.env.CHANNEL_ID,
	channelSecret: process.env.CHANNEL_SECRET,
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

const app = express();

const linebotParser = bot.parser();

app.get('/',function(req,res){
    res.send('Hello World!');
});

app.post('/linewebhook', linebotParser);

bot.on('message', function (event) {
	switch (event.message.type){
		case 'text':
			switch(event.message.type){
				case '我':
					event.source.profile().then(function (profile) {
						return event.reply('Hello ' + profile.displayName + ' ' + profile.userId);
					});
					break;
			}
	}
});

app.listen(process.env.PORT || 80, function () {
	console.log('LineBot is running.');
});