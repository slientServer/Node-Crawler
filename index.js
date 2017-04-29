var app= require('express')();
var config = require('config-lite')({
	config_basedir: __dirname
});
var crawler= require('./crawler');
var routes= require('./routes');
var logger= require('./logger/winston')();

routes(app);

app.listen(config.port, function(){
	logger.log('info', 'Server start successfully !')
	crawler(false);
});