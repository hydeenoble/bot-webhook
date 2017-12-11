var Utility = {
    rand_str:function(len,charset){
        if(!len) len = 3;
        if(!charset) charset = "abcdefghijklmnopqrstuvwxyz0123456789";
        var text = "";
        for( var i=0; i < len; i++ )
            text += charset.charAt(Math.floor(Math.random() * charset.length));
        return text;
    },

    code_generator:function(){
        return Utility.rand_str(8,"AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789")
    },

    trans_id: function(){
        return Date.now();
    },

    extract_search_data: function(param,limit){
        var _excluded_key = ["sort","from","size","aggs","range","count","search"]
        var query_type = [], start = 0, sort=[], aggs=null

        for (key in param){
            var match = {};
            (param.search) ? match[key] = "*"+param[key].toString().toLowerCase()+"*" : match[key] = param[key].toString().toLowerCase()

            if(param[key] != "" && _excluded_key.indexOf(key) == -1){
                (param.search) ? query_type.push({wildcard:match}) : query_type.push({match: match})
            }
            if(key == "range") {
                if(Array.isArray(param[key])){
                    param[key].forEach(function(eRange){
                        query_type.push({range:JSON.parse(eRange)})
                    })
                }else
                    query_type.push({range:JSON.parse(param[key])})
            }
        }

        if(query_type.length == 0) query_type = [{match_all:{}}]
        if(param.size) limit = param.size;
        if(param.from) start = param.from;
        if(param.sort) sort  = param.sort;
        if(param.aggs) {
            var _aggs  = JSON.parse(param.aggs)
            aggs = {
                "top-terms-aggregation": {
                    "terms": {
                        "field": _aggs.field,
                        "size": _aggs.size
                    }
                }
            }
        }
        var search_param = {"query":
                {"query": {
                        "bool": {}
                    }
                },
            aggs:aggs,
            size:limit,
            from:start,
            sort:sort
        };

        (param.search) ? search_param.query.query.bool['should'] = query_type : search_param.query.query.bool['must'] = query_type
        ////console.debug("Search-Param",JSON.stringify(search_param))
        return search_param;
    },


    title_case: function(text){
        var change_case = require('change-case');
        var lower = change_case.lowerCase(text);
        return change_case.upperCaseFirst(lower);
    },

    random_int: function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    decimal_point: function(value,dp){
        _dp = 1
        if(dp) _dp = dp;

        return parseFloat(value).toFixed(dp)
    },

    isEmpty: function(obj) {
        if (obj == null) return true;
        if (obj.length && obj.length > 0)    return false;
        if (obj.length === 0)  return true;
        // toString and toValue enumeration bugs in IE < 9
        for (var key in obj) {
            if (hasOwnProperty.call(obj, key)) return false;
        }
        return true;
    },

    msisdn_sanitizer: function(msisdn,plus){
        if(msisdn) {
            msisdn = msisdn.replace(/\s+/g, '');
            msisdn = msisdn.replace('+', '');

            if (!isNaN(msisdn)) {
                if (msisdn.match(/^234/i)) msisdn = '0' + msisdn.substr(3);

                if (msisdn.length == 11) {
                    msisdn = '+234' + msisdn.substr(1);

                    if (!plus)  msisdn = msisdn.replace('+', '');

                    return msisdn;
                } else {
                    return "";
                }
            } else
                return "";
        }else
            return "";
    },

    exclude_number: function(msisdn){
        var _exclude_range = ["234809944","234803200"]
        var _prefix = msisdn.substr(0,9)
        var _index = _exclude_range.indexOf(_prefix)
        if(_index > 0) return true
        else return false
    },

    keyword_sanitizer: function(keyword){
        var santized_string = keyword.replace("  ","")
        santized_string =  santized_string.replace(",,",",")
        santized_string = santized_string.replace(", ",",")
        santized_string = santized_string.replace(" ,",",")
        santized_string = santized_string.replace(", ",",")
        santized_string = santized_string.trim()
        return santized_string;
    },

    mno_sanitizer: function(mno){
        var mno = mno.toUpperCase()
        if(mno.startsWith("NIG_")){
            return mno
        }else
            return "NIG_"+mno
    },

    next_cost: function(cost,block){
        var index = block.indexOf(cost);
        var next_index = 0
        if((index+1) <= (block.length-1)) next_index = index+1
        return block[next_index]
    },

    date_time: function(dt){
        var moment = require('moment-timezone');
        return moment.tz(dt, "Africa/Lagos").format('YYYY-MM-DD HH:mm:ss');
    },


    date_time_zone: function(dt){
        var moment = require('moment-timezone');
        var europe_tz   = moment.tz(dt, "Europe/London");
        var nigerian_tz = europe_tz.clone().tz('Africa/Lagos');
        return nigerian_tz.format();
    },

    elastic_time: function(){
        var moment = require('moment-timezone');
        var mo = moment.tz(new Date(), "Africa/Lagos")
        return mo.format('YYYY-MM-DD')+"T"+mo.format('HH')+":"+mo.format('mm')+":"+mo.format('ss')+".000Z"
    },

    date_str: function(dt){
        var moment = require('moment');
        return moment(dt).format('YYYYMMDD');
    },

    militimestamp: function(){
        var moment = require('moment')
        return moment().utc().format('x')
    },

    param_extract: function(req){
        var data = {}
        if (req.fields)
            data = req.fields
        else if(req.body)
            data = req.body;

        return data
    },

    resp: function(res){
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        return res;
    },

    xmlToJson: function(url, callback) {
        var parseString = require('xml2js').parseString
        var DOMParser = require('xmldom').DOMParser;
        var http = require('http');
        http.get(url, function(res) {
            var xml = ""
            res.on('data', function(chunk) {xml += chunk})

            res.on('error', function(e) {callback(e, null)})

            res.on('timeout', function(e) {callback(e, null)})

            res.on('end', function() {
                xml = new DOMParser().parseFromString(xml,"text/xml");
                parseString(xml, function(err, result) {
                    //console.debug("Error",err)
                    callback(null, result)
                })
            })
        })
    },


    getJson: function(url,callback){
        var request = require('request');
        request(url, function (error, response, body) {
            ////console.debug("body",body)
            //console.debug("Error",error)
            if (!error && response.statusCode == 200) {
                // callback(JSON.parse(body.toString())) // Show the HTML for the Google homepage.
                callback(JSON.parse(JSON.stringify(body))) // Show the HTML for the Google homepage.
            }else{
                callback(null)
            }
        })
    },

    extract_img: function(str){
        var m,
            urls = [],
            rex = /<img.*?src="([^">]*\/([^">]*?))".*?>/g;
        while ( m = rex.exec( str ) ) {
            urls.push( m[1] );
        }
        return urls;
    },

    getPathFromUrl: function(url,param) {
        var filter = "&w"
        if(param) filter = param
        return url.split(filter)[0];
    },


    getFileNameFromUrl: function(url){
        var path = require("path");
        var extract = path.basename(url)
        return extract
    },

    maxObjectInArray: function(data,key){
        var sortData = data.sort(function(a, b) {
            return parseFloat(a[key]) - parseFloat(b[key]);
        });
        return sortData[sortData.length-1];
    },

    getKeyByValue: function(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    },

    isJson: function(str) {
        try { JSON.parse(str);
        } catch (e) { return false;
        }
        return true;
    }



};
module.exports = Utility;