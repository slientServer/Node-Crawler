module.exports ={
	port: 3000,
	mongodb: 'mongodb://localhost/crawler',//mongodb地址
	isLogin: true,
	loginInfo: {
		username: 'I308845',
		password: 'Summer2017',
		loginUrl: 'https://jira.successfactors.com/login.jsp',
    usernameKey: 'os_username',
    passwordKey: 'os_password',
    cookieKeys: ['JSESSIONID']
	},
	entranceUrl: 'https://jira.successfactors.com/secure/Dashboard.jspa',
	domParseFunction: 'jiraParse'
};