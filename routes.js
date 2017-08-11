var crawler= require('./crawler');

module.exports= function(app){
	app.use('/', function(req, res){
		res.send('234');
		crawler(res);
	});
}