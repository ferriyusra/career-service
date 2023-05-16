const express = require('express');
const multer = require('multer');
const os = require('os');

const router = express.Router();
const { validate } = require('../middlewares/validate');
const { crmAuthenticated } = require('../middlewares/crm_authenticated');

const { updateAccountRules } = require('../modules/controller/account_request');

module.exports = (accountController) => {
  // auth router
  router.put('/v1/company-profile/update', crmAuthenticated, multer({ dest: os.tmpdir() }).single('image'), updateAccountRules(), validate, (req, res, next) => accountController.upateAccount(req, res, next));

  return router;
};
