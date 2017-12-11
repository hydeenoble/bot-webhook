var courseSchema = require('./schema/CourseSchema');

var {mongoose} = require('../libraries/Connector');

var courseModel = {

    save : function (param, callback) {
        courseSchema.create(param, function (err, data) {
            if (err) return callback(courseModel.handleError(err));
            return callback(data);
        })
    },
    handleError: function(report){
        return {"error":true,"message":report};
    }
};

module.exports = courseModel;