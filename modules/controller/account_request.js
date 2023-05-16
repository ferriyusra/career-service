const { body } = require('express-validator');

const updateAccountRules = () => [
  body('name').trim().notEmpty().withMessage('name name cannot be empty'),
  body('companyDescription').trim().notEmpty().withMessage('company description cannot be empty'),
  body('location').trim().notEmpty().withMessage('company location cannot be empty'),
];

module.exports = {
  updateAccountRules,
};
