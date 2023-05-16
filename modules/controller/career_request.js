const { body, param } = require('express-validator');

const createApplicantRules = () => [
  param('jobId').trim().isUUID().withMessage('jobId must be UUID'),
  body('firstName').trim().notEmpty().withMessage('first name cannot be empty'),
  body('lastName').trim().notEmpty().withMessage('last name cannot be empty'),
  body('email')
    .trim()
    .notEmpty()
    .withMessage('email cannot be empty')
    .isEmail().normalizeEmail().withMessage('email not valid'),
  body('phoneNumber')
    .isLength({
      min: 10,
      max: 14,
    })
    .withMessage('phoneNumber min 10 or max 12 characters')
    .notEmpty()
    .withMessage('phoneNumber cannot be empty'),
];

module.exports = {
  createApplicantRules,
};
