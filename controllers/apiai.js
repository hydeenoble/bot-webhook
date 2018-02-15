var express = require('express'), router = express.Router();
var courseModel = require('./../model/CourseModel');
var courseDAO = require('../dao/CourseDAO');
var resultDAO = require('../dao/ResultDAO');

router.get('/', function(req, res){
    res.send('working');
});


router.post('/ai', (req, res) => {
    switch(req.body.result.action){
        
        case "course":
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
            return res.json({
            speech: response,
            displayText: response,
            source: 'agent'
            });
        });
        break;
        case "prerequisite":
            var course = req.body.result.parameters.course;
            courseModel.getPrerequisite(course, function(data){
                let response = `Hurray!, there is no prerequisite for ${course}.`;
                
                if (data.prerequisite){
                    response = `Oops!, prerequisite for ${course} is, ${data.prerequisite}.`;
                }
                return res.json({
                    speech: response,
                    displayText: response,
                    source: 'agent'
                });
            });
        break;
        case "details":
        var course = req.body.result.parameters.course;
        courseModel.getCourse(course, function(data){
            var response = data.code + " ("+ data.title +")" + " is a " + data.level + " level course." +
            " it is takes " + data.unit + " units of the total units of " + data.semester + " courses. it is majorly for " 
            + data.option + " option";

            if (data.prerequisite){
                response +=  "and it's prerequisite is " + data.prerequisite;
            }
            
            return res.json({
            speech: response,
            displayText: response,
            source: 'agent'
            });
        });
        break;
        case "result":
            let result_params = req.body.result.parameters;
            
            courseDAO.checkCourseAccess(result_params.level, result_params.course, function (response) {
                if(response){
                    var body = `Hello Sir/Ma, <br /> <br/>
                        A student just logged a complain, here are the details below: <br/><br/>
                        <b>Matric Number: </b> ${result_params.matric_number}.
                        <br/>
                        <b>Course: </b> ${result_params.course}.
                        <br/>
                        <b>level: </b> ${result_params.level}.
                        <br/>
                        <b>complaint: </b> ${result_params.complaint}.
                        <br/><br/>
                        Best Regards, <br/>
                        Adviser | Bot.`;

                    resultDAO.sendMail(body, function(resp){
                        console.log("Mail callback", resp);
                    });

                    return res.json({
                        speech: "Your complaint has been logged to the appropriate authorities, you should be contacted within 24hours, if you are not contacted within this time, please go and see your Part-Adviser.",
                        displayText: "Your complaint has been logged to the appropriate authorities, you should be contacted within 24hours, if you are not contacted within this time, please go and see your Part-Adviser.",
                        source: 'agent'
                    });
                    
                }else{
                    return res.json({
                        speech: "Sorry, you can't complaint about a result for a course beyond your level.",
                        displayText: "Sorry, you can complaint about a result for a course beyond your level.",
                        source: 'agent'
                    });
                }
            });
        break;
        default:
        console.log("There must have been an error!");
    }
});

module.exports = router;
