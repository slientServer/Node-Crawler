var app= require('express')();
var config = require('config-lite')({
	config_basedir: __dirname
});
var crawler= require('./crawler');
var routes= require('./routes');
var logger= require('./logger/winston')();
var later= require('later');

routes(app);

var sched= later.parse.recur().on(config.jobRunTime).time();
later.date.localTime();
later.setInterval(function(){
	logger.log('info', 'Scan start ...');
	crawler(false);
}, sched);

app.listen(config.port, function(){
	logger.log('info', 'Server start successfully!')
	// crawler(false);
});