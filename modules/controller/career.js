const { EventEmitter } = require('events');
const { paginate } = require('../../util/paginate');
const { getPaging } = require('../../util/paging');
const { getJobSearchable } = require('../job/searchable');

class CareerController extends EventEmitter {
  constructor(jobService) {
    super();

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
      if (!job) throw createError(StatusCodes.NOT_FOUND, messageConstant.JOB_NOT_FOUND);

      res.success(toJobContract(job));
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
    jobSalary: parseInt(data.jobSalary),
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

module.exports = CareerController;
