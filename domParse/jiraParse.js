var userModel= require('../model/user');
var dashModel= require('../model/dashboard');

module.exports= {
	generateDashboardSelector: function generateDashboardSelector(){
		return [
			{
				key: 'gadgetList',
				selector: ['.gadget .dashboard-item-frame'],//Reserved for id and index should be 0
				content: 'id'
			},
			{
				key: 'gadgetName',
				selector: ['.dashboard-item-header .dashboard-item-title'],
				content: 'innerHTML'
			},
			{
				key: 'totals',
				selector: ['.dashboard-item-content tbody tr:last-child td:last-child a', 
									'.dashboard-item-content .results-count a', 
									'.dashboard-item-content .legend-title b',
									'.dashboard-item-content tbody tr:last-child td:last-child a',
									'.dashboard-item-content tbody tr:last-child td a'],
				content: 'innerText'
			},
			{
				key: 'gadgetFilter',
				selector: ['.dashboard-item-content .data-footer .filter'],
				content: 'innerText'
			}
		];
	},

	saveResultToDB: function parseResultHandler(scanResult){
		dashModel.create(scanResult);
	}
}