const CrmController = require('./controller/crm');
const AuthController = require('./controller/auth');
const CareerController = require('./controller/career');
const AccountController = require('./controller/account');

const JobRepository = require('./job/repository');
const UserRepository = require('./user/repository');
const ApplicantRepository = require('./applicant/repository');

const JobService = require('./job/service');
const UserService = require('./user/service');
const ApplicationService = require('./applicant/service');

function createAuthController(userService) {
  return new AuthController(userService);
}

function createCrmController(jobService) {
  return new CrmController(jobService);
}

function createCareerController(jobService, applicantService) {
  return new CareerController(jobService, applicantService);
}

function createAccountController(userService) {
  return new AccountController(userService);
}

function createJobRepository(db) {
  return new JobRepository(db);
}

function createUserRepository(db) {
  return new UserRepository(db);
}

function createApplicantRepository(db) {
  return new ApplicantRepository(db);
}

function createJobService(repo) {
  return new JobService(repo);
}

function createApplicantService(repo) {
  return new ApplicationService(repo);
}

function createUserService(repo) {
  return new UserService(repo);
}

module.exports = {
  createCrmController,
  createAuthController,
  createCareerController,
  createAccountController,

  createJobRepository,
  createUserRepository,
  createApplicantRepository,

  createJobService,
  createUserService,
  createApplicantService,
};
