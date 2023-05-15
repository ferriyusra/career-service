const createError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');

const config = require('../config');

function crmAuthenticated(req, res, next) {
	try {
		const authHeader = req.headers.authorization;

		if (!authHeader) {
			throw new Error('Invalid header.');
		}

		const token = authHeader.split(' ')[1];

		const user = jwt.verify(token, config.auth.jwtSecretCrm);

		if (!user.data || !user.data.userId) {
			throw new Error('Invalid user.');
		}

		req.user = {
			id: user.data.userId,
			name: user.data.name,
		};

		return next();
	} catch (e) {
		throw createError(StatusCodes.UNAUTHORIZED, e.message);
	}
}

module.exports = {
	crmAuthenticated,
};
