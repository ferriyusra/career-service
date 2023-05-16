const { body, param } = require('express-validator');

const getJobRules = () => [
  param('id').trim().isUUID().withMessage('id must be UUID'),
];

const createJobRules = () => [
  body('name')
    .trim().notEmpty().withMessage('job name cannot be empty'),
  body('periodFromAt')
    .notEmpty().withMessage('periodFromAt cannot be empty')
    .toDate().isISO8601().withMessage('periodFromAt must be an ISO date.'),
  body('periodToAt')
    .notEmpty().withMessage('periodToAt cannot be empty')
    .toDate().isISO8601().withMessage('periodToAt must be an ISO date.'),
  body('description')
    .trim().notEmpty().withMessage('job deecription cannot be empty'),
  body('jobType')
    .trim().notEmpty().withMessage('job type cannot be empty'),

  body('isSalary').trim().notEmpty().withMessage('is salary cannot be empty'),
  body('salary').isInt().withMessage('Salary must be an integer value'),
];

const updateJobRules = () => [
  ...getJobRules(),
  ...createJobRules(),
];

module.exports = {
  getJobRules,
  createJobRules,
  updateJobRules,
};
