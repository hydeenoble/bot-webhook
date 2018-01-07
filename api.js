const express = require('express');
let bodyParser = require('body-parser');
let request = require('request');

var courseModel = require('./model/CourseModel');

let _config = require('config.json')('./config/app.json');

const app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(require('./controllers'));

// request.get('http://a4afd344.ngrok.io/data.json', (error, response, body) => {
//     if(error) {
//         return console.log(error);
//     }

//     var data = []

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
//             if(element.courseLevel == 1){temp.level = "100 level";}
//             if(element.courseLevel == 2){temp.level = "200 level";}
//             if(element.courseLevel == 3){temp.level = "300 level";}
//             if(element.courseLevel == 4){temp.level = "400 level";}
//             if(element.courseLevel == 5){temp.level = "500 level";}
//         }
//         if(element.title){temp.title = element.title;}
//         if(element.prerequisite){temp.prerequisite = element.prerequisite;}
        
//         if(element.option){
//             if(element.option == 1){temp.option = "Computer Science with Economic option"}
//             if(element.option == 2){temp.option = "Computer Engineering"}
//             if(element.option == 3){temp.option = "Computer Science with Maths"}
//             if(element.option == 4){temp.option = "All Options"}
//         }

//         courseModel.save(temp, function (resp) {
//             console.log(resp);
//         });
//     });

//     console.log(data);
// });

app.listen(_config.api._port, function() {
    console.log('%s version %s.. Listening at http://[:]%s%s%s',_config.app_name,_config.app_version,
        _config.api._port,_config.app_base,_config.api._url+_config.api._version
    );
})