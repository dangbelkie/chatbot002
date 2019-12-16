var restify = require('restify'); 
var builder = require('botbuilder');  
// Setup Restify Server 
var server = restify.createServer(); 

var MICROSOFT_APP_ID = d04b2753-6a447-4fd5-8680-d02751b7338a;
var MICROSOFT_APP_PASSWORD = d04b2753-6a447-4fd5-8680-d02751b7338a;
var PMC_USERNAME = dbelkie@toadfire.com;
var PMC_PASSWORD = RedRedBlack@@5;
var PMC_APP_ID = a10a52fae8104c638606c95402f031e9;

const axios = require('axios');
const instance = axios.create({
    baseURL: 'https://console.parkmycloud.com',
    headers: {"Content-Type": "application/json", "Accept": "application/json"}
})
server.listen(process.env.port || process.env.PORT || 3333, 
function () {    
    console.log('%s listening to %s', server.name, server.url);  
});  
// chat connector for communicating with the Bot Framework Service 
var connector = new builder.ChatConnector({     
    appId: MICROSOFT_APP_ID,     
    appPassword: MICROSOFT_APP_PASSWORD
});
// Listen for messages from users  
server.post('/api/messages', connector.listen());  
// Receive messages from the user and respond by echoing each message back (prefixed with 'You said:') 
var bot = new builder.UniversalBot(connector, function (session) {     
    //session.send("You said: %s", session.message.text); 
    if (session.message.text.indexOf("get resources") !=-1) { getResources(session) }
    if (session.message.text.indexOf("get schedules") !=-1) { getSchedules(session) }
    if (session.message.text.indexOf("snooze") !=-1) { 
        var arr = session.message.text.split(" ");
        snoozeResources(session, arr[1], arr[2]);
    }
    if (session.message.text.indexOf("toggle") !=-1) { 
        var arr = session.message.text.split(" ");
        toggleResources(session, arr[1]);
    }
    if (session.message.text.indexOf("attach") !=-1) { 
        var arr = session.message.text.split(" ");
        attachSchedule(session, arr[1], arr[2]);
    }
    if (session.message.text.indexOf("detach") !=-1) { 
        var arr = session.message.text.split(" ");
        attachSchedule(session, arr[1], null);
    }
});

function getResources(session) {
    instance.post('/auth', {
            username: PMC_USERNAME,
            password: PMC_PASSWORD,
            app_id: PMC_APP_ID
        })
        .then(function(response) {
            instance({
                method:'get',
                url:'/resources-simple',
                headers: {'Accept':'application/json', 'X-Auth-Token':response.data.token}
            })
                .then(function(response){
                    response.data.items.forEach(function(item){
                        session.send("%s - %s", item.id, item.name)
                    })
                })
        })
}

function getSchedules(session) {
    instance.post('/auth', {
            username: PMC_USERNAME,
            password: PMC_PASSWORD,
            app_id: PMC_APP_ID
        })
        .then(function(response) {
            instance({
                method:'get',
                url:'/schedules',
                headers: {'Accept':'application/json', 'X-Auth-Token':response.data.token}
            })
                .then(function(response){
                    response.data.forEach(function(item){
                        session.send("%s - %s", item.id, item.name)
                    })
                })
        })
}

function snoozeResources(session, item_ids, snooze_period) {
    instance.post('/auth', {
            username: PMC_USERNAME,
            password: PMC_PASSWORD,
            app_id: PMC_APP_ID
        })
        .then(function(response) {
            instance({
                method:'put',
                url:'/resources/snooze',
                headers: {'Accept':'application/json', 'X-Auth-Token':response.data.token},
                data: { "item_ids": [ parseInt(item_ids) ], "snooze_period": parseInt(snooze_period) }
            })
                .then(function(response){
                    session.send("Instance will snooze until - %s", response.data.snooze_until)
                })
        })
}

function toggleResources(session, item_ids, snooze_period) {
    instance.post('/auth', {
            username: PMC_USERNAME,
            password: PMC_PASSWORD,
            app_id: PMC_APP_ID
        })
        .then(function(response) {
            instance({
                method:'put',
                url:'/resources/toggle',
                headers: {'Accept':'application/json', 'X-Auth-Token':response.data.token},
                data: { "item_ids": [ parseInt(item_ids) ] }
            })
                .then(function(response){
                    session.send("Instance toggled")
                })
        })
}

function attachSchedule(session, item_ids, schedule_id) {
    instance.post('/auth', {
            username: PMC_USERNAME,
            password: PMC_PASSWORD,
            app_id: PMC_APP_ID
        })
        .then(function(response) {
            instance({
                method:'put',
                url:'/resources/toggle',
                headers: {'Accept':'application/json', 'X-Auth-Token':response.data.token},
                data: { "item_ids": [ parseInt(item_ids) ] , "schedule_id": parseInt(schedule_id) }
            })
                .then(function(response){
                    session.send("Instance schedule changed")
                })
        })
}
