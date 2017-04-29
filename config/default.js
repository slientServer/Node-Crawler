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
		text: 'Hello, easy text~',
		html: '<b>Hello, html ~</b>'	
	}

};