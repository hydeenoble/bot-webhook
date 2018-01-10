var _config = require('config.json')('./config/app.json');
var Resp = require('../dao/Response');
var courseModel = require('../model/CourseModel');
var Util = require('../libraries/Utility');

var initDAO = {

    create: function (param, callback) {
        var error  = [];

        if(!param.code){error.push('Provide Course code')}
        if(!param.title){error.push('Provide Course title')}
        if(!param.unit){error.push('Provide Course unit')}
        // if(!param.prerequisites){error.push('Provide Course prerequisites')}
        if(!param.level){error.push('Provide Course level')}
        if(!param.semester){error.push('Provide Course semester')}
        // if(!param.icon){error.push('Provide category icon')}

        if(error.length == 0){
            let data = {
                code:param.code,
                title:param.title,
                unit:param.unit,
                prerequisites:param.prerequisites,
                level:param.level,
                semester:param.semester
            }

            courseModel.save(data, function (resp) {
                if (!resp._id){
                    return callback(Resp.error({msg: "Course with information already exist"}));
                }else{
                    return callback(Resp.success({msg: "Course successfully added.", resp: resp}));
                }
            });

        }else{
            return callback(Resp.error({msg: 'Invalid Parameter', resp: error}))
        }
    },


    // update: function (param, callback) {
    //     var error = [];
    //     var data = {};
    //
    //     if (!param.identity){error.push('Provide Identity')}
    //     if (param.name){data.name = param.name}
    //     if (param.tag){data.tag = param.tag}
    //     if (param.icon){data.icon = param.icon}
    //     if (param.description){data.description = param.description}
    //
    //     if (error.length == 0){
    //         if (data) {
    //             courseModel.update(data, {_id: param.identity}, function (resp) {
    //                 if (!resp._id){
    //                     return callback(Resp.error({msg: "Something went wrong updating service information"}));
    //                 }else{
    //                     return callback(Resp.success({msg: "Service successfully updated", resp: resp}));
    //                 }
    //             });
    //         }else{
    //             return callback(Resp.error({msg: 'Provide at least one data to update'}))
    //         }
    //     }else{
    //         return callback(Resp.error({msg: 'Invalid Parameter', resp: error}))
    //     }
    // },


    // by_identity: function(identity,callback){
    //     courseModel.findOne({conditions:{_id:identity}},function(state){
    //         if(state && !state.error)
    //             return callback(Resp.success({msg:"Data result found",resp:state}));
    //         else
    //             return callback(Resp.error({msg:'No data found for Query',resp:null}))
    //     })
    // },


    pull: function (param, callback) {
        courseModel.search(Util.extract_search_data(param,_config.api_query_limit), function (state) {
            var response = Resp.error({msg:'No data found for Query',resp:null});
            if(state && state.length > 0){
                var resp = state;
                // if(param.count) resp = state.total;
                response = Resp.success({msg:state.length+" data found",resp:state});
            }
            return callback(response)
        });
    },


    // del: function (param, callback) {
    //     var error = [];
    //
    //     if (!param.identity){error.push('Provide Identity')}
    //
    //     if (error.length == 0){
    //         courseModel.del(param.identity, function (resp) {
    //             if (resp){
    //                 return callback(Resp.success({msg: "Data successfully deleted"}));
    //
    //             }else{
    //                 return callback(Resp.error({msg: "Error deleting data"}));
    //             }
    //         });
    //
    //     }else{
    //         return callback(Resp.error({msg: 'Invalid Parameter', resp: error}))
    //     }
    // }
};

module.exports = initDAO;