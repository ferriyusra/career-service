const { EventEmitter } = require('events');
const { v4: uuidv4 } = require('uuid');
const createError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const path = require('path');
const { getJobSearchable } = require('../job/searchable');
const { paginate } = require('../../util/paginate');
const { getPaging } = require('../../util/paging');
const { ROOT_PATH } = require('../../config/constant');
const messageConstant = require('../../config/messageConstant');
const NormalizePhoneNumber = require('../../util/normalizePhoneNumber');

class CareerController extends EventEmitter {
  constructor(jobService, applicantService) {
    super();

    this.applicantService = applicantService;
    this.jobService = jobService;
  }

  async listJobs(req, res, next) {
    try {
      const { query } = req;

      const paging = getPaging(query, getJobSearchable());

      const jobs = await this.jobService.listJobs(paging);

      const data = jobs.rows.map((job) => toJobContract(job));

      res.success(paginate(data, jobs.count, paging));
    } catch (error) {
      next(error);
    }
  }

  async getJob(req, res, next) {
    try {
      const { id } = req.params;

      // get job
      const job = await this.jobService.getJob(id);

      res.success(toJobContract(job));
    } catch (error) {
      next(error);
    }
  }

  async sendApplicant(req, res, next) {
    try {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
      } = req.body;
      const { jobId } = req.params;

      // get job
      const job = await this.jobService.getJob(jobId);

      const normalizePhoneNumber = NormalizePhoneNumber.normalizePhoneNumber(phoneNumber);

      // validate image
      if (!req.file) {
        throw createError(
          StatusCodes.BAD_REQUEST,
          messageConstant.FILE_REQUIRED,
        );
      }

      const allowedMimeTypes = ['application/pdf'];
      if (!allowedMimeTypes.includes(req.file.mimetype)) {
        throw createError(StatusCodes.BAD_REQUEST, messageConstant.INVALID_FILE);
      }

      if (req.file.size > 2000000) {
        // max 2MB
        throw createError(StatusCodes.BAD_REQUEST, messageConstant.SIZE_FILE_TOO_LARGE);
      }

      const tmpPath = req.file.path;
      const originalExt =
        req.file.originalname.split('.')[
        req.file.originalname.split('.').length - 1
        ];
      const filename = `${req.file.filename}.${originalExt}`;
      const targetPath = path.resolve(ROOT_PATH, `public/upload/applicant_resume/${filename}`);

      const src = fs.createReadStream(tmpPath);
      const dest = fs.createWriteStream(targetPath);
      src.pipe(dest);
      src.on('end', async () => {
        try {
          // create applicant
          const applicant = await this.applicantService.createApplicant({
            id: uuidv4(),
            jobId: job.id,
            jobName: job.jobName,
            companyId: job.companyId,
            firstName,
            lastName,
            email,
            phoneNumber: normalizePhoneNumber,
            resume: filename,
          });

          res.success(toApplicantContract(applicant));
        } catch (err) {
          fs.unlinkSync(targetPath);
          next(err);
        }
      });
    } catch (error) {
      next(error);
    }
  }
}

function toJobContract(data) {
  const object = {
    id: data.id,
    companyId: data.companyId,
    jobName: data.jobName,
    jobPeriodFrom: data.jobPeriodFrom,
    jobPeriodTo: data.jobPeriodTo,
    jobDescription: data.jobDescription,
    jobSalary: parseInt(data.jobSalary, 10),
    jobIsSalary: data.jobIsSalary,
    jobType: data.jobType,
    companyName: data.companyName,
    companyImage: data.companyImage,
    companyLocation: data.companyLocation,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
  return object;
}

function toApplicantContract(data) {
  return {
    id: data.id,
    jobId: data.jobId,
    jobName: data.jobName,
    companyId: data.companyId,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phoneNumber: data.phoneNumber,
    resume: data.resume,
    status: data.status,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
}

module.exports = CareerController;
