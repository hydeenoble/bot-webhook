const express = require('express');
let bodyParser = require('body-parser');
let request = require('request');

process.setMaxListeners(Infinity);

let _config = require('config.json')('./config/app.json');

const app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

app.use(require('./controllers'));
  
app.listen(process.env.PORT || _config.api._port, function() {
    console.log('%s version %s.. Listening at http://[:]%s%s%s',_config.app_name,_config.app_version,
        _config.api._port,_config.app_base,_config.api._url+_config.api._version
    );
});
