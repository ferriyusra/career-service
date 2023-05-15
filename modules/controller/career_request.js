const { body, param } = require('express-validator');

const createUserRules = () => [
	body('name').trim().notEmpty().withMessage('name name cannot be empty'),
	body('email')
		.trim()
		.notEmpty()
		.withMessage('email cannot be empty')
		.isEmail().normalizeEmail().withMessage('email not valid'),
	body('password')
		.isLength({
			min: 6,
			max: 16,
		})
		.withMessage('password min 6 or max 12 characters')
		.notEmpty()
		.withMessage('password cannot be empty'),
	body('companyDescription').trim().notEmpty().withMessage('company description cannot be empty'),
];

const createLoginRules = () => [
	body('email')
		.trim()
		.notEmpty()
		.withMessage('email cannot be empty')
		.isEmail().normalizeEmail().withMessage('email not valid'),
	body('password')
		.isLength({
			min: 6,
			max: 16,
		})
		.withMessage('password min 6 or max 12 characters')
		.notEmpty()
		.withMessage('password cannot be empty'),
];

module.exports = {
	createUserRules,
	createLoginRules
};
