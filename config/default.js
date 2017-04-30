module.exports ={
	port: 3000,
	mongodb: 'mongodb://localhost/crawler',//mongodb地址
	isLogin: true,
	loginInfo: {
		loginUrl: 'https://jira.successfactors.com/login.jsp',
		logoutUrl: 'https://jira.successfactors.com/logout',
    usernameKey: 'os_username',
    passwordKey: 'os_password',
    cookieKeys: ['JSESSIONID']
	},
	entranceUrl: 'https://jira.successfactors.com/secure/Dashboard.jspa',
	domParseFunction: 'jiraParse',
	email: {
		senderAddress: 'jira.helper.center@gmail.com',
		senderPass: 'talentcdp',
		senderEmailType: 'gmail',
		senderName: '"Jira-Helper-Center 👻" <jira.helper.center@gmail.com>',
		subject: 'Jira Update Notification',
		text: 'Welcome to Jira Helper ~',
		html: '<h2>Jira Helper Notify Email</h2>'+
					'<hr><p style="margin: 20px 0 20px 0">Dear [nickname]: </p> According latest scan result, your dashboards have some updates as below:'+
					'<div class="display: block; margin: 20px 0 0 0;">[maincontent]</div>'+
					'<p style="margin: 20px 0 0 0">Best Regards</p>'+
					'<p>Jira Helper Center</P>'
	}

};