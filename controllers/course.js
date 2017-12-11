var express = require('express'), router = express.Router();
var Util = require('./../libraries/Utility');
var courseDAO = require('./../dao/CourseDAO');

router.post('/create', function (req, res) {

    // res.send(Util.param_extract(req));
    courseDAO.create(Util.param_extract(req), function (state) {
        Util.resp(res).json(state);
    });
});

router.post('/modify', function (req, res) {
    courseDAO.update(Util.param_extract(req), function (state) {
        Util.resp(res).json(state);
    });
});

router.get('/by-identity', function(req, res) {
    courseDAO.by_identity(req.query.identity,function(state){
        Util.resp(res).json(state)
    })
})

router.get('/pull', function (req, res) {
    courseDAO.pull(req.query, function (state) {
        Util.resp(res).json(state);
    })
});

router.get('/delete', function (req, res) {
    courseDAO.del(req.query, function (state) {
        Util.resp(res).json(state);
    });
});

router.get('/', function (req, res) {
    res.send('Hello World! in controller');
});

module.exports = router;