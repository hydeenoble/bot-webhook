var _config = require('config.json')('./config/app.json');
var Resp = require('../dao/Response');
var Util = require('../libraries/Utility');
const nodemailer = require('nodemailer');

var initDAO = {
    sendMail: function (body, callback) {
        
        nodemailer.createTestAccount((err, account) => {

            let transporter = nodemailer.createTransport({
                service: 'Mailgun',
                auth: {
                    user: _config.mail.user,
                    pass: _config.mail.password 
                }
            });

            let mailOptions = {
                from: '"Bot" <bot@bot.com>',
                to: _config.mail.receiver, 
                subject: 'RESULT COMPLAINT | BOT', 
                html: body 
            };

        // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error){
                    return callback({error: true, response: error});
                }else{
                    return callback({error: false, response: info});
                }
            });
        });
    }
};

module.exports = initDAO;