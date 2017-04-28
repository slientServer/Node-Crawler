var config = require('config-lite')({
	config_basedir: __dirname
});
var mongoose = require('mongoose');
mongoose.plugin(require('../plugin/lastMod'));
mongoose.connect(config.mongodb, { config: { autoIndex: true } });

var userSchema= mongoose.Schema({
	employeeId: {type: String, required: true, index: {unique: true}},
	password: String,
	openId: String,
	email: String,
	nickname: String,
	department: String,
	isNotifyWechat: {type: String, enum: ['y', 'n']},
	isNotifyEmail: {type: String, enum: ['y', 'n']},
	phone: String,
});
exports.User= mongoose.model('User', userSchema);

var dashboardSchema= mongoose.Schema({
	scanCount: Number,
	employeeId: String,
	dashboardId: Number,
	totals: Number,
	dashboardName: String,
	gadgetId: String,
	gadgetName: String,
	gadgetFilter: String,
	otherData: mongoose.Schema.Types.Mixed,
});
exports.Dashboard= mongoose.model('Dashboard', dashboardSchema);