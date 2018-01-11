const express = require('express');
let bodyParser = require('body-parser');
let request = require('request');

process.setMaxListeners(Infinity);

var courseModel = require('./model/CourseModel');

let _config = require('config.json')('./config/app.json');

const app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(require('./controllers'));


const apiaiApp = require('apiai')('d2e7924e603641ce831d853597a8cb74');


app.get('/', function(req, res){
    res.send('working');
});

/* For Facebook Validation */
app.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] && req.query['hub.verify_token'] === 'ololade95') {
      res.status(200).send(req.query['hub.challenge']);
    } else {
      res.status(403).end();
    }
  });
  
  /* Handling all messenges */
  app.post('/webhook', (req, res) => {
    console.log(req.body);
    if (req.body.object === 'page') {
      req.body.entry.forEach((entry) => {
        entry.messaging.forEach((event) => {
          if (event.message && event.message.text) {
            sendMessage(event);
          }
        });
      });
      res.status(200).end();
    }
  });
  
  app.post('/ai', (req, res) => {
      if (req.body.result.action === 'course') {
          console.log(req.body.result.parameters);
          var params = req.body.result.parameters;

          var response = "The courses to register for " + params.semester + ', ' 
          + params.level + ' level ('+ params.option +' option) are: \n\n';

          courseModel.getCourses(params, function(data){
            data.forEach(function(item){
              response += "Course Code: " + item.code + '\n' + 
                "Course Title: " + item.title + '\n' + 
                "Course Unit: " + item.unit + '\n\n';
            });

            console.log("normal",response);
            return res.json({
              speech: response,
              displayText: response,
              source: 'agent'
            });

          });
    }
});
  
  
  
  function sendMessage(event) {
    let sender = event.sender.id;
    let text = event.message.text;
  
    let apiai = apiaiApp.textRequest(text, {
      sessionId: 'tabby_cat' // use any arbitrary id
    });
  
    apiai.on('response', (response) => {
        let aiText = response.result.fulfillment.speech;
      
          request({
            url: 'https://graph.facebook.com/v2.6/me/messages',
            qs: {access_token: 'EAAWeOtMv0ZBABAAMFoJjDLI45jsGaZAmvCpnbiapwDwZCb5jlrdyZB01yeKT1LNaRlFUlgIKBLgitGW9blHW738ZCcDGWs6FmfdYswUMceK4OTsG5Q2BCp6d2SzJY3DvVZAbQRkzXZBWvRvMe284RktbuPamFSdwZCUqzDyun2k7fwZDZD'},
            method: 'POST',
            json: {
              recipient: {id: sender},
              message: {text: aiText}
            }
          }, (error, response) => {
            if (error) {
                console.log('Error sending message: ', error);
            } else if (response.body.error) {
                console.log('Error: ', response.body.error);
            }
          });
       });
  
    apiai.on('error', (error) => {
      console.log(error);
    });
  
    apiai.end();
  }
    




// request.get('https://4424d83b.ngrok.io/data.json', (error, response, body) => {
//     if(error) {
//         return console.log(error);
//     }

//     var data = []

//     console.log("Lenght",JSON.parse(body).length);
//     JSON.parse(body).forEach(element => {
//         var temp = {};
//         if(element.courseName){temp.code = element.courseName;}
//         if(element.courseSemester){
//             if(element.courseSemester == 1){
//                 temp.semester = "First Semester";
//             }else{
//                 temp.semester = "Second Semester";
//             }
//         }
//         if(element.courseUnit){temp.unit = element.courseUnit;}
//         if(element.courseLevel){
//             if(element.courseLevel == 1){temp.level = "100";}
//             if(element.courseLevel == 2){temp.level = "200";}
//             if(element.courseLevel == 3){temp.level = "300";}
//             if(element.courseLevel == 4){temp.level = "400";}
//             if(element.courseLevel == 5){temp.level = "500";}
//         }
//         if(element.title){temp.title = element.title;}
//         if(element.prerequisite){temp.prerequisite = element.prerequisite;}
        
//         if(element.option){
//             if(element.option == 1){temp.option = "economics"}
//             if(element.option == 2){temp.option = "engineering"}
//             if(element.option == 3){temp.option = "maths"}
//             if(element.option == 4){temp.option = "all"}
//         }

//         courseModel.save(temp, function (resp) {
//             console.log(resp);
//         });
//     });

//     // console.log(data);
// });



app.listen(process.env.PORT || _config.api._port, function() {
    console.log('%s version %s.. Listening at http://[:]%s%s%s',_config.app_name,_config.app_version,
        _config.api._port,_config.app_base,_config.api._url+_config.api._version
    );
});
