const { deepFreeze } = require('../util');

const config = {
	app: {
		env: process.env.NODE_ENV || 'development',
		name: process.env.APP_NAME || 'career-service',
		port: Number(process.env.APP_PORT) || 3000,
		version: process.env.APP_VERSION,
	},
	auth: {
		jwtIssuer: process.env.AUTH_JWT_ISSUER,
		jwtSecret: process.env.AUTH_JWT_SECRET,
		jwtSecretCrm: process.env.AUTH_JWT_SECRET_CRM,
		jwtSecretCrmRefreshToken: process.env.AUTH_JWT_SECRET_CRM_REFRESH_TOKEN,
	},
	query: {
		limitDefault: Number(process.env.QUERY_LIMIT_DEFAULT) || 10,
		sortDefault: process.env.QUERY_SORT_DEFAULT || 'created_at desc',
	},
	rds: {
		url: process.env.RDS_URL,
	},
};

module.exports = deepFreeze(config);
