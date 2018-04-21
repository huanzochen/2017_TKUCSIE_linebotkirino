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
			switch(event.message.text){
				case '我':
					event.source.profile().then(function (profile) {
						return event.reply('Hello ' + profile.displayName + ' ' + profile.userId);
					});
					break;
				case '資料':
					event.reply('Unknow message: ' + JSON.stringify(event));
					break;
				case '我愛你':
					event.reply('我也4^_^');
					break;
				case '我喜歡你':
					event.reply('好臭你這臭宅');
					break;
				case 'buttont':
					event.reply({
						type: 'template',
						altText: 'this is a buttons template',
						template: {
						type: 'buttons',
						thumbnailImageUrl: 'https://example.com/bot/images/image.jpg',
						title: 'Menu',
						text: 'Please select',
						actions: [{
						  type: 'postback',
						  label: 'Buy',
						  data: 'action=buy&itemid=123'
						}, {
						  type: 'postback',
						  label: 'Add to cart',
						  data: 'action=add&itemid=123'
						}, {
						  type: 'uri',
						  label: 'View detail',
						  uri: 'http://example.com/page/123'
						}]
						}
					});
				case 'confirmt':
					event.reply({
						type: 'template',
						altText: 'this is a confirm template',
						template: {
						type: 'confirm',
						text: 'Are you sure?',
						actions: [{
						type: 'message',
						label: 'Yes',
						text: 'yes'
						}, {
						type: 'message',
						label: 'No',
						text: 'no'
						}]
						}
					});
				case 'carouselt':
					event.reply({
						type: 'template',
						altText: 'this is a carousel template',
						template: {
						type: 'carousel',
						columns: [{
						thumbnailImageUrl: 'https://example.com/bot/images/item1.jpg',
						title: 'this is menu',
						text: 'description',
						actions: [{
						type: 'postback',
						label: 'Buy',
						data: 'action=buy&itemid=111'
						}, {
						type: 'postback',
						label: 'Add to cart',
						data: 'action=add&itemid=111'
						}, {
						type: 'uri',
						label: 'View detail',
						uri: 'http://example.com/page/111'
						}]
						}, {
						thumbnailImageUrl: 'https://example.com/bot/images/item2.jpg',
						title: 'this is menu',
						text: 'description',
						actions: [{
						type: 'postback',
						label: 'Buy',
						data: 'action=buy&itemid=222'
						}, {
						type: 'postback',
						label: 'Add to cart',
						data: 'action=add&itemid=222'
						}, {
						type: 'uri',
						label: 'View detail',
						uri: 'http://example.com/page/222'
						}]
						}]
						}
					});
				default: 
					event.reply(event.message.text);
					break;
			}
	}
});

app.listen(process.env.PORT || 80, function () {
	console.log('LineBot is running.');
});