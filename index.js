const linebot = require('linebot');
const express = require('express');

const bot = linebot({
	channelId: process.env.1575785851,
	channelSecret: process.env.aafc68bcd645d9079d3729ae19ca88b4,
	channelAccessToken: process.env.SgtBZvjsyQxoXIsvwDBLGRLgi5ow47hioy87ROoplt1qCajIw2YmvdHl/ciX5AmenBy6tKoOYN7stzP/IesuS7dTwHD6WfLydecFFJPyul7LWDK3zF2QgRHbmPx4BfeHA9ONj3i3msVD/7HHQwejggdB04t89/1O/w1cDnyilFU=
});

const app = express();

const linebotParser = bot.parser();

app.get('/',function(req,res){
    res.send('Hello World!');
});

app.post('/linewebhook', linebotParser);

bot.on('message', function (event) {
	event.reply(event.message.text).then(function (data) {
		console.log('Success', data);
	}).catch(function (error) {
		console.log('Error', error);
	});
});

app.listen(process.env.PORT || 80, function () {
	console.log('LineBot is running.');
});