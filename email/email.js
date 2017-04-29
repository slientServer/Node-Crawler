const nodemailer = require('nodemailer');
var config = require('config-lite')({
    config_basedir: __dirname
});
var logger= require('../logger/winston')();

module.exports= function(targetUser){
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        service: config.email.senderEmailType,
        auth: {
            user: config.email.senderAddress,
            pass: config.email.senderPass
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: config.email.senderName, // sender address
        to: 'biao.hao@sap.com', // list of receivers
        subject: config.email.subject, // Subject line
        text: config.email.text, // plain text body
        html: config.email.html // html body
    };
    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return logger.log('warning', 'send email to %s failed: %s', targetUser, error);
        }
        logger.log('info', 'Message from %s to %s sent successfully', config.email.senderName, targetUser);
    });

}

