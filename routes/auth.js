const express = require('express');
const multer = require('multer');
const os = require('os');

const router = express.Router();
const { validate } = require('../middlewares/validate');

const { createUserRules, createLoginRules } = require('../modules/controller/auth_request');

module.exports = (authController) => {
  // auth router
  router.post('/v1/auth/register', multer({ dest: os.tmpdir() }).single('image'), createUserRules(), validate, (req, res, next) => authController.createUser(req, res, next));
  router.post('/v1/auth/login', createLoginRules(), validate, (req, res, next) => authController.login(req, res, next));

  return router;
};
