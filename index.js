const linebot = require('linebot');
const express = require('express');
var schedule = require('node-schedule');
const rp = require('request-promise');
const nodejieba = require('nodejieba');
//var rp = require('request-promise');

const bot = linebot({
	channelId: process.env.CHANNEL_ID,
	channelSecret: process.env.CHANNEL_SECRET,
	channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN
});

const app = express();
const linebotParser = bot.parser();
const users = ['U2d55a16eef4b016fca5636960bf50d15','XXXXXXXXXXXX'];

var makeupjson = [];
var replytext = ['食物','美妝','購物','閒聊','科技','動漫','男生','經濟','遊戲','女生','電影','運動','旅遊','綜藝','汽車'];
var replyfood = '';
var replymakeup = '';
var replybuyonline = '';
var replytalk = '';
var reply3c = '';
var replyacg = '';
var replyboy = '';
var replyfinance = '';
var replygame = '';
var replygirl = '';
var replymovie = '';
var replysport = '';
var replytravel = '';
var replytvepisode = '';
var replyvehicle = '';
var replytheme=new Array(15);
var Fjson = new Object;
var theme = ['talk/Food','talk/Makeup','talk/buyonline','talk/Talk','talk/3c','talk/acg','talk/boy','talk/finance','talk/game','talk/girl','talk/movie','talk/sport','talk/travel','talk/tvepisode','talk/vehicle'];
var thmct = 0
var Filename = [];
//nodejieba.load({userDict:'./dict.utf8'})
//Filename = Gettime();
Filename = '201805302120';
Messuparray();

var rule = new schedule.RecurrenceRule();  
rule.minute = [0,10,20,30,40,50];
var j = schedule.scheduleJob(rule, function(){  
    var rd = Math.floor(Math.random()*15);
    bot.push(users, {
        type: 'text',
        text: replytext[rd]+'\n'+replytheme[rd]
    });
    replytheme=['','','','','','','','','','','','','','',''];
    thmct = 0;
    Filename = Gettime();
    Messuparray();
    console.log('rd:'+rd);
});
/**
var j = schedule.scheduleJob('5 * * * *', function(){
    var rd = Math.floor(Math.random()*15);
    bot.push(users, {
        type: 'text',
        text: replytext[rd]+'\n'+replytheme[rd]
    });
    replytheme=['','','','','','','','','','','','','','',''];
    thmct = 0;
    Getjson();
    console.log('rd:'+rd);
});
*/

function Messuparray(){
    replytheme=new Array(15);
    for(var s=0;s<15;s++){
            replytheme[s]=[''];
    }
    Getjson(thmct);
}

function Gettime(){
        var today=new Date();
        var Fmonth,Fdate,Fhours,Fminutes;
        today.setHours(today.getHours() + 8);
        today.setMinutes(today.getMinutes() - 10);
            if((today.getMonth()+1)<10){
                Fmonth = '0'+(today.getMonth()+1);
            }
            else if(9<(today.getMonth()+1)<13){
                Fmonth = (today.getMonth()+1);
            }
            else{console.log("月錯誤");}
            if((today.getDate())<10){
                Fdate = '0'+(today.getDate());
            }
            else if(9<(today.getDate())<32){
                Fdate = (today.getDate());
            }
            else{console.log("日錯誤");};
            if(today.getHours()<10){
                Fhours = '0'+(today.getHours());
            }
            else if(9<today.getHours()<24){
                Fhours = (today.getHours());
            }
            else{console.log("小時錯誤");}
            if(today.getMinutes()<10){
                Fminutes = ('0'+today.getMinutes());
            }
            else if(9<today.getMinutes()<61){
                Fminutes = (today.getMinutes());
            }
            else{console.log("分錯誤");}
            if(Fminutes%10>0&&Fminutes>10){ //分歸整
                Fminutes = (Fminutes-(Fminutes%10));
            }
            else if(Fminutes%10>0&&Fminutes>0){
                Fminutes = '00';
            }
            Filename=(today.getFullYear()+Fmonth+Fdate+Fhours+Fminutes);
        //console.log('Fminutes='+Fminutes); //檢查分鐘數
        //console.log(Filename); //檔案名稱
        console.log(Filename);
        return Filename;
}


function Getjson(thmct){
    console.log(thmct+"http://projectkarubi.hopto.org/"+theme[thmct]+"/"+Filename+".json");

        var opts = {
            uri: "http://projectkarubi.hopto.org/"+theme[thmct]+"/"+Filename+".json",
            json: true
        };
        rp(opts)
        .then(function (json) {
            var thmlen = 0;
            Fjson[thmct]=json;
            for(var k=0;k<json[0].Summary.length;k++){
                        if(replytheme[thmct][thmlen].length<=1300){
                            replytheme[thmct][thmlen]= (replytheme[thmct][thmlen]+json[0].Summary[k].title+":\n");
                            replytheme[thmct][thmlen]= (replytheme[thmct][thmlen]+json[0].Summary[k].excerpt+"\n----------\n");
                        }
                        else if(replytheme[thmct][thmlen].length>=1300){
                            thmlen++;
                            replytheme[thmct][thmlen]= (replytheme[thmct][thmlen]+json[0].Summary[k].title+":\n");
                            replytheme[thmct][thmlen]= (replytheme[thmct][thmlen]+json[0].Summary[k].excerpt+"\n----------\n");
                        }
            }
            if(thmct<14){
                Getjson((thmct+1));  
            }
            else if(thmct>=14){
            }
            else{
                console.log('在資料儲存過程中出現未知錯誤!');
            }
        })
        .catch(function (err) {
            console.log(err);
            console.log('出錯了'+theme[thmct]);
        });

        
    
}



app.get('/',function(req,res){
    res.send('Hello World!');
});

app.post('/linewebhook', linebotParser);

bot.on('follow',   function (event) { 
	event.reply([
					{ type: 'text', text: '哈囉!歡迎使用新聞機器人!' },
					{ type: 'text', text: '請點選下方選項獲取最新資訊' },
					{
						type: 'template',
						altText: '選項',
						template: {
						type: 'buttons',
						text: '選項',
						actions: [{
								type: 'message',
								label: '選單',
								text: '選單'
							}, {
								type: 'message',
								label: '關於我們',
								text: '關於我們'
							}]
						}
					},
					]);
});

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
				case '選單': 
					event.reply([
					{
						type: 'template',
						altText: '選單',
						template: {
						type: 'buttons',
						title: '主題',
						text: '請選擇主題',
						actions: [{
							type: 'message',
							label: '美妝',
							text: '美妝新聞'
						}, {
							type: 'message',
							label: '旅遊',
							text: '旅遊新聞'
						}, {
							type: 'message',
							label: '金融',
							text: '金融新聞'
						}, {
							type: 'message',
							label: '運動',
							text: '運動新聞'
						}]
						}
					},
					{
						type: 'template',
						altText: '選單2',
						template: {
						type: 'buttons',
						text: '主題2',
						actions: [{
							type: 'message',
							label: '綜藝',
							text: '綜藝新聞'
						}, {
							type: 'message',
							label: '科技',
							text: '科技新聞'
						}, {
							type: 'message',
							label: '動漫',
							text: '動漫新聞'
						}, {
							type: 'message',
							label: '遊戲',
							text: '遊戲新聞'
						}]
						}
					},
					{
						type: 'template',
						altText: '選單3',
						template: {
						type: 'buttons',
						text: '主題3',
						actions: [{
							type: 'message',
							label: '汽車',
							text: '汽車新聞'
						}, {
							type: 'message',
							label: '電影',
							text: '電影新聞'
						}, {
							type: 'message',
							label: '男生話題',
							text: '男生話題'
						}, {
							type: 'message',
							label: '女生話題',
							text: '女生話題'
						}]
						}
					},
					{
						type: 'template',
						altText: '選單4',
						template: {
						type: 'buttons',
						text: '主題4',
						actions: [{
							type: 'message',
							label: '美食',
							text: '美食新聞'
						}, {
							type: 'message',
							label: '閒聊',
							text: '閒聊話題'
						}, {
							type: 'message',
							label: '國際',
							text: '國際新聞'
						}, {
							type: 'message',
							label: '購物',
							text: '購物新聞'
						}]
						}
					},
					]);
					break;
                case '生活': 
					event.reply([
					{
						type: 'template',
						altText: '選單',
						template: {
						type: 'buttons',
						title: '生活',
						text: '請選擇主題',
						actions: [{
							type: 'message',
							label: '美食',
							text: '美食新聞'
						}, {
							type: 'message',
							label: '購物',
							text: '購物新聞'
						}, {
							type: 'message',
							label: '旅遊',
							text: '旅遊新聞'
						}, {
							type: 'message',
							label: '美妝',
							text: '美妝新聞'
						}]
						}
					}]);
					break;
                case '潮流': 
					event.reply([
					{
						type: 'template',
						altText: '選單',
						template: {
						type: 'buttons',
						title: '潮流',
						text: '請選擇主題',
						actions: [{
							type: 'message',
							label: '科技',
							text: '科技新聞'
						}, {
							type: 'message',
							label: '汽車',
							text: '汽車新聞'
						}, {
							type: 'message',
							label: '金融',
							text: '金融新聞'
						}, {
							type: 'message',
							label: '運動',
							text: '運動新聞'
						}]
						}
					}]);
					break;
                case '娛樂': 
					event.reply([
					{
						type: 'template',
						altText: '選單',
						template: {
						type: 'buttons',
						title: '娛樂',
						text: '請選擇主題',
						actions: [{
							type: 'message',
							label: '綜藝',
							text: '綜藝新聞'
						}, {
							type: 'message',
							label: '動漫',
							text: '動漫新聞'
						}, {
							type: 'message',
							label: '遊戲',
							text: '遊戲新聞'
						}, {
							type: 'message',
							label: '電影',
							text: '電影新聞'
						}]
						}
					}]);
					break;
                case '八卦': 
					event.reply([
					{
						type: 'template',
						altText: '選單',
						template: {
						type: 'buttons',
						title: '八卦',
						text: '請選擇主題',
						actions: [{
							type: 'message',
							label: '男生',
							text: '男生話題'
						}, {
							type: 'message',
							label: '女生',
							text: '女生話題'
						}, {
							type: 'message',
							label: '閒聊',
							text: '閒聊話題'
						}]
						}
					}]);
					break;
                case '選單2':
                    
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
                            type: 'message',
                            label: '閒聊',
                            text: '閒聊話題'
                          },{
                            type: 'message',
                            label: '遊戲',
                            text: '遊戲話題'
                          },{
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
					break;
                case '美妝新聞':
                    //event.reply(json[0].Summary[0].excerpt);
                    event.reply(replytheme[1]);
                    console.log('xxx'+replytheme[1]);
                    break;
                case '美食新聞':
                    //event.reply(json[0].Summary[0].excerpt);
                    event.reply(replytheme[0]);
                    console.log('xxx'+replytheme[0]);
                    break;
                case '閒聊話題':
                    //event.reply(json[0].Summary[0].excerpt);
                    event.reply(replytheme[3]);
                    console.log('xxx'+replytheme[3]);
                    break;
                case '購物新聞':
                    //event.reply(json[0].Summary[0].excerpt);
                    event.reply(replytheme[2]);
                    console.log('xxx'+replytheme[2]);
                    break;
                case '科技新聞':
                    //event.reply(json[0].Summary[0].excerpt);
                    event.reply(replytheme[4]);
                    console.log('xxx'+replytheme[4]);
                    break;
                case '動漫新聞':
                    //event.reply(json[0].Summary[0].excerpt);
                    event.reply(replytheme[5]);
                    console.log('xxx'+replytheme[5]);
                    break;
                case '男生話題':
                    //event.reply(json[0].Summary[0].excerpt);
                    event.reply(replytheme[6]);
                    console.log('xxx'+replytheme[6]);
                    break;
                case '金融新聞':
                    //event.reply(json[0].Summary[0].excerpt);
                    event.reply(replytheme[7]);
                    console.log('xxx'+replytheme[7]);
                    break;
                case '遊戲新聞':
                    //event.reply(json[0].Summary[0].excerpt);
                    event.reply(replytheme[8]);
                    console.log('xxx'+replytheme[8]);
                    break;
                case '女生話題':
                    //event.reply(json[0].Summary[0].excerpt);
                    event.reply(replytheme[9]);
                    console.log('xxx'+replytheme[9]);
                    break;
                case '電影新聞':
                    //event.reply(json[0].Summary[0].excerpt);
                    event.reply(replytheme[10]);
                    console.log('xxx'+replytheme[10]);
                    break;
                case '運動新聞':
                    //event.reply(json[0].Summary[0].excerpt);
                    event.reply(replytheme[11]);
                    console.log('xxx'+replytheme[11]);
                    break;
                case '旅遊新聞':
                    //event.reply(json[0].Summary[0].excerpt);
                    event.reply(replytheme[12]);
                    console.log('xxx'+replytheme[12]);
                    break;
                case '綜藝新聞':
                    //event.reply(json[0].Summary[0].excerpt);
                    event.reply(replytheme[13]);
                    console.log('xxx'+replytheme[13]);
                    break;
                case '汽車新聞':
                    //event.reply(json[0].Summary[0].excerpt);
                    event.reply(replytheme[14]);
                    console.log('xxx'+replytheme[14]);
                    break;
				case 't1':
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
					break;
				case 't2':
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
					break;
				case 't3':
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
					break;
				case 'imgmap':
					event.reply({
						type: 'imagemap',
						baseUrl: 'https://example.com/bot/images/rm001',
						altText: 'this is an imagemap',
						baseSize: { height: 1040, width: 1040 },
						actions: [{
						type: 'uri',
						linkUri: 'https://example.com/',
						area: { x: 0, y: 0, width: 520, height: 1040 }
						}, {
						type: 'message',
						text: 'hello',
						area: { x: 520, y: 0, width: 520, height: 1040 }
						}]
					});
				break;
				case 'multext':
					event.reply(['Hello, world 1', 'Hello, world 2']);
				break;
				case 'msgobj':
					event.reply({ type: 'text', text: 'Hello, world' });
				break;
				case 'mulmsgobj':
					event.reply([
					{ type: 'text', text: 'Hello, world 1' },
					{ type: 'text', text: 'Hello, world 2' }
					]);
				break;
				case 'img':
					event.reply({
					type: 'image',
					originalContentUrl: 'https://example.com/original.jpg',
					previewImageUrl: 'https://example.com/preview.jpg'
					});
				break;
				default:
                    ans = nodejieba.cutAll(event.message.text);
                    Workjieba(event,ans);
					break;
			}
	}
});

function Workjieba(event,ans){
    //event.reply(ans);
    console.log('綜藝'+(replytheme[13][0].length)+replytheme[13][0]);
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    console.log('\n綜藝2:\n'+(replytheme[13][1].length)+'你有問題嗎媽嗎?'+replytheme[13][1]);
    /*
    var Kfood = new Array;
    var Kmakeup = new Array;
    var Kbuyonline = new Array;
    var Ktalk = new Array;
    var K3c = new Array;
    var Kanimate = new Array;
    var Kboy = new Array;
    var Kfinance = new Array;
    var Kgame = new Array;
    var Kgirl = new Array;
    var Kmovie = new Array;
    var Ksport = new Array;
    var Ktravel = new Array;
    var Ktvepisode = new Array;
    var Kvehicle = new Array;
    */
    

        Kfood = (Fjson[0][0].topic[0]);
        Kfood2 = (Fjson[0][0].topic);
        console.log('Kfood:'+Kfood+'Kfood2:'+Kfood2);

    
    
    
    
    
}

app.listen(process.env.PORT || 80, function () {
	console.log('LineBot is running.');
});