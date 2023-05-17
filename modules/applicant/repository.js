const { camelToSnakeCase } = require('../../util/string');

class ApplicantRepository {
  constructor(dbClient) {
    this.db = dbClient;
  }

  async listApplicants(paging) {
    let sql = `SELECT 
                    a.id,
                    a.job_id,
                    a.job_name,
                    a.company_id,
                    a.first_name,
                    a.last_name,
                    a.email,
                    a.phone_number,
                    a.resume,
                    a.status,
                    a.created_at,
                    a.updated_at
                    FROM applicants a
                    INNER JOIN users u ON u.id = a.company_id
                    WHERE a.deleted_at IS NULL`;

    let sqlCount = 'SELECT COUNT(*) FROM applicants a WHERE a.deleted_at IS NULL';

    // add where for query
    if (paging.search) {
      Object.keys(paging.search).forEach((key) => {
        if (typeof paging.search[key] !== 'object') {
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

  async createApplicant(data) {
    const {
      id,
      jobId,
      jobName,
      companyId,
      firstName,
      lastName,
      email,
      phoneNumber,
      resume,
    } = data;

    const sql = `INSERT INTO applicants(
                 id, job_id, job_name, company_id, first_name, last_name, email, phone_number, resume)
                 VALUES(
                  $1, $2, $3, $4, $5, $6, $7, $8, $9
                  ) 
                 RETURNING id, job_id, job_name, company_id, first_name, last_name, email, phone_number, resume, status, created_at, updated_at`;

    const values = [
      id,
      jobId,
      jobName,
      companyId,
      firstName,
      lastName,
      email,
      phoneNumber,
      resume,
    ];

    const response = await this.db.query(sql, values);

    return toDto(response.rows[0]);
  }

  async updateApplicant(jobId, data) {
    let sql = 'UPDATE applicants SET updated_at = NOW(),';
    const values = [];
    let counter = 1;

    Object.keys(data).forEach((key, index) => {
      sql += ` ${camelToSnakeCase(key)} = $${index + 1},`;
      values.push(data[key]);
      counter += 1;
    });

    sql = sql.slice(0, -1);
    sql += ` WHERE id = $${counter}`;

    values.push(jobId);

    sql += 'RETURNING job_id, job_name, first_name, last_name, email, phone_number, resume, status, created_at, updated_at';

    const response = await this.db.query(sql, values);
    return toDto(response.rows[0]);
  }
}

function toDto(data) {
  return {
    id: data.id,
    jobId: data.job_id,
    jobName: data.job_name ?? null,
    companyId: data.company_id ?? null,
    firstName: data.first_name,
    lastName: data.last_name,
    email: data.email,
    phoneNumber: data.phone_number,
    resume: data.resume,
    status: data.status,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
  };
}

module.exports = ApplicantRepository;
