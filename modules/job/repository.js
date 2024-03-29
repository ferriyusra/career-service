const { RecordNotFoundError } = require('../../error');
const { camelToSnakeCase } = require('../../util/string');
const logger = require('../../util/logger');

class JobRepository {
  constructor(dbClient) {
    this.db = dbClient;
  }

  async listJobs(paging) {
    let sql = `SELECT 
                  j.id,
                  j.company_id,
                  j.job_name,
                  lower(j.period) AS period_from_at,
                  upper(j.period) AS period_to_at,
                  j.description,
                  j.salary,
                  j.is_salary,
                  j.job_type,
                  j.created_at,
                  j.updated_at,
                  u.name AS company_name,
                  u.image AS company_image,
                  u.location AS company_location,
                  u.company_description
                  FROM jobs j
                  INNER JOIN users u ON u.id = j.company_id
                  WHERE j.deleted_at IS NULL`;

    let sqlCount = 'SELECT COUNT(*) FROM jobs WHERE deleted_at IS NULL';

    // add where for query
    if (paging.search) {
      Object.keys(paging.search).forEach((key) => {
        if (typeof (paging.search[key]) !== 'object') {
          sql += ` AND ${key} = '${paging.search[key]}'`;
          sqlCount += ` AND ${key} = '${paging.search[key]}'`;
        } else if (paging.search[key].like) {
          sql += ` AND ${key} ILIKE '%${paging.search[key].like}%'`;
          sqlCount += ` AND ${key} ILIKE '%${paging.search[key].like}%'`;
        }
      });
    }
    // add order by for query
    if (paging.sort) {
      sql += ` ORDER BY ${paging.sort}`;
    }

    // add limit and offset
    sql += ` LIMIT ${paging.limit} OFFSET ${paging.offset}`;

    // get data
    const responses = await this.db.query(sql);

    // get total COUNT
    const responsesWithCount = await this.db.query(sqlCount);

    return {
      rows: responses.rows.map((response) => toDto(response)),
      count: Number(responsesWithCount.rows[0].count),
    };
  }

  async getJob(id) {
    const sql = `SELECT
                    j.id,
                    j.company_id,
                    j.job_name,
                    lower(j.period) AS period_from_at,
                    upper(j.period) AS period_to_at,
                    j.description,
                    j.salary,
                    j.is_salary,
                    j.job_type,
                    j.created_at,
                    j.updated_at,
                    u.name company_name,
                    u.image company_image,
                    u.location company_location,
                    u.company_description
                    FROM jobs j
                    INNER JOIN users u ON u.id = j.company_id
                    WHERE j.id=$1 AND j.deleted_at IS NULL`;

    const value = [id];

    const response = await this.db.query(sql, value);

    if (response.rowCount !== 0) {
      return toDto(response.rows[0]);
    }

    throw new RecordNotFoundError();
  }

  async updateJob(id, data) {
    const updateData = { ...data };

    let sql = 'UPDATE jobs SET updated_at = NOW()';
    const values = [];
    let counter = 1;

    // format period
    if (updateData.periodFromAt && updateData.periodToAt) {
      sql += `, period = $${counter}`;
      values.push(`[${updateData.periodFromAt.toISOString()}, ${updateData.periodToAt.toISOString()}]`);
      counter += 1;
    }
    delete updateData.periodFromAt;
    delete updateData.periodToAt;

    Object.keys(updateData).forEach((key, _index) => {
      sql += `, ${camelToSnakeCase(key)} = $${counter}`;
      values.push(updateData[key]);
      counter += 1;
    });

    sql += ` WHERE id = $${counter}`;
    values.push(id);

    sql += `RETURNING
            id, company_id, job_name,
            lower(period) AS period_from_at,
            upper(period) AS period_to_at,
            description, salary, is_salary, job_type,
            created_at, updated_at`;

    const response = await this.db.query(sql, values);
    return toDto(response.rows[0]);
  }

  async createJob(data) {
    const {
      id,
      companyId,
      name,
      periodFromAt,
      periodToAt,
      description,
      salary,
      isSalary,
      jobType,
    } = data;

    const period = `[${periodFromAt.toISOString()}, ${periodToAt.toISOString()}]`;

    const sql = `INSERT INTO jobs(
                    id, company_id, job_name, period, description, salary, is_salary, job_type
                    ) 
                    VALUES ($1, $2, $3, $4, $5, $6, $7, $8) 
                  RETURNING
                  id, company_id, job_name,
                  lower(period) AS period_from_at,
                  upper(period) AS period_to_at,
                  description, salary, is_salary, job_type,
                  created_at, updated_at`;

    const values = [id, companyId, name, period, description, salary, isSalary, jobType];

    const response = await this.db.query(sql, values);

    return toDto(response.rows[0]);
  }
}

function toDto(data) {
  return {
    id: data.id,
    companyId: data.company_id,
    jobName: data.job_name,
    jobPeriodFrom: data.period_from_at,
    jobPeriodTo: data.period_to_at,
    jobDescription: data.description,
    jobSalary: data.salary,
    jobIsSalary: data.is_salary,
    jobType: data.job_type,
    companyName: data.company_name,
    companyImage: data.company_image,
    companyLocation: data.company_location,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

module.exports = JobRepository;
