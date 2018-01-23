var express = require('express'), router = express.Router();

var Util = require('./../libraries/Utility');
let _config = require('config.json')('./config/app.json');

/* For Facebook Validation */
router.get('/webhook', (req, res) => {
    if (req.query['hub.mode'] && req.query['hub.verify_token'] === _config.apiai.verify_token) {
        res.status(200).send(req.query['hub.challenge']);
    } else {
        res.status(403).end();
    }
  });
  
  /* Handling all messenges */
router.post('/webhook', (req, res) => {
if (req.body.object === 'page') {
    req.body.entry.forEach((entry) => {
        entry.messaging.forEach((event) => {
            if (event.message && event.message.text) {
                Util.sendMessage(event);
            }
        });
    });

    res.status(200).end();
}
});

module.exports = router;
  