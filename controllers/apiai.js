var express = require('express'), router = express.Router();
var courseModel = require('./../model/CourseModel');

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

        default:
        console.log("There must have been an error!");
    }
});

module.exports = router;
