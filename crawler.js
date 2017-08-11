var Nightmare = require('nightmare');
var nightmare = Nightmare({ show: true, typeInterval: 20})
var config = require('config-lite')({
	config_basedir: __dirname
});
module.exports= function(res) {
	login();
	login();
	login();

	function login(){
		nightmare
		.goto(config.DC2)
		.wait('#username')
		.type('#username', config.username)
		.type('#password', config.password)
		.click('.splButton-primary.btn')
		.wait('.ace_text-input')
		.type('.ace_text-input', 'hahahahhahahhah')
		.click('.search-button .btn')
		.then(function(){

		})
		.catch(function(error){

		});
	}
}