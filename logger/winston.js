var winston= require('winston');
var path= require('path');
var logger = new (winston.Logger)({
	transports: [
	  new (winston.transports.Console)(),
	  new (winston.transports.File)({ filename: path.join(__dirname, '/data.log')})
	]
});

module.exports= function() {
	return logger;
}