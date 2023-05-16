const { camelToSnakeCase } = require('../../util/string');

class ApplicantRepository {
  constructor(dbClient) {
    this.db = dbClient;
  }

  async createApplicant(data) {
    const {
      id,
      jobId,
      firstName,
      lastName,
      email,
      phoneNumber,
      resume,
    } = data;

    const sql = `INSERT INTO applicants(
                 id, job_id, first_name, last_name, email, phone_number, resume)
                 VALUES(
                  $1, $2, $3, $4, $5, $6, $7
                  ) 
                 RETURNING id, job_id, first_name, last_name, email, phone_number, resume, status, created_at, updated_at`;

    const values = [
      id,
      jobId,
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

    sql += 'RETURNING job_id, first_name, last_name, email, phone_number, resume, status, created_at, updated_at';

    const response = await this.db.query(sql, values);
    return toDto(response.rows[0]);
  }
}

function toDto(data) {
  return {
    id: data.id,
    jobId: data.job_id,
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
