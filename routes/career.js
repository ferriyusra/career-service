const express = require('express');
const multer = require('multer');
const os = require('os');

const router = express.Router();
const { validate } = require('../middlewares/validate');

const {
  getJobRules,
} = require('../modules/controller/crm_request');
const { createApplicantRules } = require('../modules/controller/career_request');

module.exports = (careerController) => {
  // job router
  router.get('/v1/job/:id', getJobRules(), validate, (req, res, next) => careerController.getJob(req, res, next));
  router.get('/v1/jobs', (req, res, next) => careerController.listJobs(req, res, next));

  // applicant router
  router.post('/v1/job/:jobId/submit', multer({ dest: os.tmpdir() }).single('resume'), createApplicantRules(), validate, (req, res, next) => careerController.sendApplicant(req, res, next));

  return router;
};
