var cheerio= require('cheerio');

module.exports= function(renderRes, dom){
	var cheerioDom = cheerio.load(dom);
	var dashbordsUrls= getAllDashbordsUrls(dom);
	renderRes.send(dashbordsUrls);

	function getAllDashbordsUrls(dom){
		var dashbords= eval((new RegExp('AG[^]DashboardManager[^]setup\\({[^]*}\\);', 'm').exec(dom))[0].replace('AG.DashboardManager.setup', '')).layouts;
		var urls= [];
		dashbords.forEach(function(value, key){
			urls.push(value.id);
		});
		return urls;
	}
}