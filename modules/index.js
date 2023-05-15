const crmController = require('./controller/crm');
const authController = require('./controller/auth');
const careerController = require('./controller/career');

const JobRepository = require('./job/repository');
const UserRepository = require('./user/repository');

const JobService = require('./job/service');
const UserService = require('./user/service');

function createAuthController(jobService) {
	return new authController(jobService);
}

function createCrmController(jobService) {
	return new crmController(jobService);
}

function createCareerController(jobService) {
	return new careerController(jobService);
}

function createJobRepository(db) {
	return new JobRepository(db);
}

function createUserRepository(db) {
	return new UserRepository(db);
}

function createJobService(repo) {
	return new JobService(repo);
}

function createUserService(repo) {
	return new UserService(repo);
}

module.exports = {
	createCrmController,
	createAuthController,
	createCareerController,

	createJobRepository,
	createUserRepository,

	createJobService,
	createUserService,
};
