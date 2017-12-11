var mongoose = require('mongoose');
var _config = require('config.json')('./config/app.json')
var _collection = _config.mongodb.collections;

var Schema = mongoose.Schema;

var schemaDef = new Schema({
    code: {type: String, unique: true},
    title: {type: String},
    unit: {type: Number},
    prerequisites: {type: String},
    level: {type: Number},
    semester: {type: String},
    option: {type: Number}
});

var courseSchema = mongoose.model(_collection.course, schemaDef);

module.exports = courseSchema;