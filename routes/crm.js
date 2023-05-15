const express = require('express');

const router = express.Router();
const { validate } = require('../middlewares/validate');
const { crmAuthenticated } = require('../middlewares/crm_authenticated');

const {
	getJobRules,
	createJobRules,
	updateJobRules,
} = require('../modules/controller/crm_request');

module.exports = (crmController) => {
	// job router
	router.post('/v1/job', crmAuthenticated, createJobRules(), validate, (req, res, next) => crmController.createJob(req, res, next));
	router.get('/v1/job/:id', crmAuthenticated, getJobRules(), validate, (req, res, next) => crmController.getJob(req, res, next));
	router.put('/v1/job/:id', crmAuthenticated, updateJobRules(), validate, (req, res, next) => crmController.updateJob(req, res, next));
	router.get('/v1/jobs', crmAuthenticated, (req, res, next) => crmController.listJobs(req, res, next));

	return router;
};
