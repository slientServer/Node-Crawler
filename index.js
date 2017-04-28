var app= require('express')();
var config = require('config-lite')({
	config_basedir: __dirname
});
var crawler= require('./crawler');
var routes= require('./routes');

routes(app);

app.listen(config.port, function(){
	console.log('Server start successfully!');
	crawler(false);
});