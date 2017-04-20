var crawler= require('./crawler');

module.exports= function(app){
	app.use('/', function(req, res){
		crawler(req, res);
	});
}