const { EventEmitter } = require('events');
const { v4: uuidv4 } = require('uuid');
const { DateTime } = require('luxon');
const { paginate } = require('../../util/paginate');
const { getPaging } = require('../../util/paging');
const { getJobSearchable } = require('../job/searchable');
const { getApplicantSearchable } = require('../applicant/searchable');
const { ValidationError } = require('../../error');

const messageConstant = require('../../config/messageConstant');

class CrmController extends EventEmitter {
  constructor(jobService, applicantService) {
    super();

    this.applicantService = applicantService;
    this.jobService = jobService;
  }

  async listJobs(req, res, next) {
    try {
      const { query } = req;
      const companyId = req.user.id;

      const paging = getPaging({ ...query, companyId }, getJobSearchable());

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

  async createJob(req, res, next) {
    try {
      const {
        name, periodFromAt, periodToAt, description, salary, jobType, isSalary,
      } = req.body;
      const companyId = req.user.id;

      const periodFromAtOri = periodFromAt;
      const periodToAtOri = periodToAt;

      // check periodTo must be later than periodFrom
      if (periodToAtOri < periodFromAtOri) {
        throw new ValidationError(messageConstant.PERIODTO_MUST_LATER_PERIODFROM);
      }

      // create job
      const periodFrom = DateTime.fromJSDate(periodFromAtOri).startOf('day').toJSDate();
      const periodTo = DateTime.fromJSDate(periodToAtOri).endOf('day').toJSDate();
      const job = await this.jobService.createJob({
        id: uuidv4(),
        companyId,
        name,
        periodFromAt: periodFrom,
        periodToAt: periodTo,
        description,
        salary,
        isSalary,
        jobType,
      });

      res.success(toJobContract(job));
    } catch (error) {
      next(error);
    }
  }

  async updateJob(req, res, next) {
    try {
      const {
        name, periodFromAt, periodToAt, description, salary, jobType, isSalary,
      } = req.body;
      const { id } = req.params;

      // get job
      const job = await this.jobService.getJob(id);

      const periodFromAtOri = periodFromAt;
      const periodToAtOri = periodToAt;

      // check periodTo must be later than periodFrom
      if (periodToAtOri < periodFromAtOri) {
        throw new ValidationError(messageConstant.PERIODTO_MUST_LATER_PERIODFROM);
      }

      // update job
      const periodFrom = DateTime.fromJSDate(periodFromAtOri).startOf('day').toJSDate();
      const periodTo = DateTime.fromJSDate(periodToAtOri).endOf('day').toJSDate();
      const updatedJob = await this.jobService.updateJob(
        job.id,
        {
          jobName: name,
          periodFromAt: periodFrom,
          periodToAt: periodTo,
          description,
          salary,
          isSalary,
          jobType,
        },
      );

      res.success(toJobContract(updatedJob));
    } catch (error) {
      next(error);
    }
  }

  async deleteJob(req, res, next) {
    try {
      const { id } = req.params;

      const job = await this.jobService.deleteJob(id);

      res.success({ job });
    } catch (error) {
      next(error);
    }
  }

  async listApplicants(req, res, next) {
    try {
      const { query } = req;
      const companyId = req.user.id;

      const paging = getPaging({ ...query, companyId }, getApplicantSearchable());

      const applicants = await this.applicantService.listApplicants(paging);

      const data = applicants.rows.map((applicant) => toApplicantContract(applicant));

      res.success(paginate(data, applicants.count, paging));
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

module.exports = CrmController;
