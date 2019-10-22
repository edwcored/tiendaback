var emailHelper = {};


var nodemailer = require('nodemailer');
var CONFIG = require('./Config');

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: CONFIG.EMAIL,
        pass: CONFIG.EMAILPASSWORD
    }
});


emailHelper.sendEmail = function(email, title, body){
    var mailOptions = {
        from: CONFIG.EMAIL,
        to: email,
        subject: title,
        text: body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email enviado: ' + info.response);
        }
    });

}


module.exports = emailHelper;