var express = require('express')
    , router = express.Router()
var _config = require('config.json')('./config/app.json');

var api_url = _config.app_base+_config.api._url+_config.api._version;


router.use(api_url+'/course', require('./course'))
router.use('/', require('./webhook'));
router.use('/', require('./apiai'));

/*
 other links below....
 */

router.get(api_url+'/', function(req, res) {
    res.send('Home page')
})

router.get(api_url+'/about', function(req, res) {
    res.send('Learn about us')
})

module.exports = router





