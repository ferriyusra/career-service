/* eslint-disable no-unused-vars */
require('dotenv').config();

const compression = require('compression');
const cors = require('cors');
const express = require('express');
const httpContext = require('express-http-context');
const helmet = require('helmet');
const createError = require('http-errors');
const morgan = require('morgan');

const config = require('./config');
const { createDatabase } = require('./db');
const {
  DatabaseUniqueViolationError,
  RecordNotFoundError,
} = require('./error');
const logger = require('./util/logger');
const successHandler = require('./middlewares/success_handler');

const {
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
} = require('./modules');

const crmRouter = require('./routes/crm');
const authRouter = require('./routes/auth');
const careerRouter = require('./routes/career');
const accountRouter = require('./routes/account');

express.response.success = successHandler;

// init express
logger.info('Initializing express');
const app = express();

async function main() {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(helmet());
  app.use(cors());
  app.use(compression());

  if (app.get('env') !== 'test') {
    app.use(
      morgan((tokens, req, res) => {
        logger.info(
          `morgan ${tokens.method(req, res)} ${tokens.url(
            req,
            res,
          )} ${tokens.status(req, res)}`,
        );
      }),
    );
  }

  // generate request ID for each request
  logger.info('Generating request ID');
  const generateRandomString = (length = 10) => Math.random().toString(20).substr(2, length);

  app.use(httpContext.middleware);
  app.use((req, res, next) => {
    const requestId = req.headers['request-id'];
    if (requestId) {
      req.requestId = requestId;
      httpContext.set('requestId', requestId);
    } else {
      req.requestId = generateRandomString();
      httpContext.set('requestId', req.requestId);
    }
    next();
  });

  // init database
  logger.info('Initializing database');
  const db = await createDatabase(config.rds.url);

  // init dependencies
  logger.info('Initializing dependencies');
  const jobRepository = createJobRepository(db);
  const userRepository = createUserRepository(db);
  const applicantRepository = createApplicantRepository(db);

  const jobService = createJobService(jobRepository);
  const userService = createUserService(userRepository);
  const applicantService = createApplicantService(applicantRepository);

  const crmController = createCrmController(jobService);
  const authController = createAuthController(userService);
  const careerController = createCareerController(jobService, applicantService);
  const accountController = createAccountController(userService);

  // init observers
  // require('./modules/controller/file_observer')(fileController);

  // init routes
  logger.info('Initializing routes');
  app.use('/crm', crmRouter(crmController));
  app.use('/crm', authRouter(authController));
  app.use('/career', careerRouter(careerController));
  app.use('/account', accountRouter(accountController));

  app.get('/', (req, res) => {
    res.send(`${config.app.name} ${config.app.env} v${config.app.version}.`);
  });

  // handle 404
  app.use((req, res, next) => {
    next(createError(404));
  });

  // throw 404 for RecordNotFoundError
  app.use((err, req, res, next) => {
    if (err instanceof RecordNotFoundError) {
      return res.status(404).json({
        message: err.message,
        success: false,
        data: null,
        responseTime: err.responseTime,
        _error_: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      });
    }

    return next(err);
  });

  // throw 409 for DatabaseUniqueViolationError
  app.use((err, req, res, next) => {
    if (err instanceof DatabaseUniqueViolationError) {
      return res.status(409).json({
        message: err.message,
        success: false,
        data: null,
        responseTime: err.responseTime,
        _error_: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      });
    }

    return next(err);
  });

  app.use((err, req, res, next) => {
    if (app.get('env') !== 'test') {
      logger.error('err', err.message);
    }

    res.status(err.status || 500);
    res.json({
      message: err.message,
      success: false,
      data: null,
      responseTime: err.responseTime,
      _error_: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
  });
}

main();

module.exports = app;
