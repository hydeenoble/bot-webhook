var courseSchema = require('./schema/CourseSchema');

var {mongoose} = require('../libraries/Connector');

var courseModel = {

    save : function (param, callback) {
        courseSchema.create(param, function (err, data) {
            if (err) return callback(courseModel.handleError(err));
            return callback(data);
        })
    },
    search: function(param, callback){
        courseSchema.find({}, function(err, resp){
            if (err) return callback(courseModel.handleError(err));
            return callback(resp);
        });
    },
    getCourses: function(param, callback){
        courseSchema.find({}, 'code unit title prerequisite').where('level', param.level)
            .where('semester', param.semester)
            .or([{option: param.option},{option: 'all'}])
            .exec(function(err, data){
                if (err) return callback(courseModel.handleError(err));
                return callback(data);
            });
    },
    getPrerequisite: function(param, callback){
        courseSchema.findOne({}, 'prerequisite').where('code', param)
        .exec(function(err, data){
            if (err) return callback(courseModel.handleError(err));
            return callback(data);
        });
    },
    getCourse: function(param, callback){
        courseSchema.findOne({}).where('code', param)
        .exec(function(err, data){
            if (err) return callback(courseModel.handleError(err));
            return callback(data);
        });
    },
    handleError: function(report){
        return {"error":true,"message":report};
    }
};

module.exports = courseModel;