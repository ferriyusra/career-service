const express = require('express');

const router = express.Router();
const { validate } = require('../middlewares/validate');

const {
	getJobRules,
} = require('../modules/controller/crm_request');

module.exports = (careerController) => {
	// job router
	router.get('/v1/job/:id', getJobRules(), validate, (req, res, next) => careerController.getJob(req, res, next));
	router.get('/v1/jobs', (req, res, next) => careerController.listJobs(req, res, next));

	return router;
};
