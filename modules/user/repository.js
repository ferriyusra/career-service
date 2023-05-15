const { RecordNotFoundError } = require('../../error');
const logger = require('../../util/logger');
const { camelToSnakeCase } = require('../../util/string');

class UserRepository {
	constructor(dbClient) {
		this.db = dbClient;
	}

	async getCompanyByNameOrEmail(name, email) {
		const sql = `SELECT id, name, email, image, password, is_company, password, company_description, location, created_at, updated_at FROM users WHERE name=$1 OR email=$2 AND is_company = TRUE AND deleted_at IS NULL`;

		const value = [name, email];
		console.log(sql)

		const response = await this.db.query(sql, value);

		if (response.rowCount !== 0) {
			return toDto(response.rows[0]);
		}

		return null;
	}

	async getUserCompany(email) {
		const sql = `SELECT id, name, email, image, password, is_company, password, company_description, location, created_at, updated_at FROM users WHERE email=$1 AND is_company = TRUE AND deleted_at IS NULL`;

		const value = [email];

		const response = await this.db.query(sql, value);

		if (response.rowCount !== 0) {
			return toDtoLogin(response.rows[0]);
		}

		return null;
	}

	async createUser(data) {
		const { name, email, image, location, password, company_description } = data;

		const sql = `INSERT INTO users(name, email, image, location, password, company_description) VALUES ($1, $2, $3, $4, $5, $6) 
								RETURNING id, name, email, image, location, is_company, company_description`;

		const values = [name, email, image, location, password, company_description];

		const response = await this.db.query(sql, values);

		return toDto(response.rows[0]);
	}
}

function toDto(data) {
	const object = {
		id: data.id,
		name: data.name,
		email: data.email,
		image: data.image,
		location: data.location,
		isCompany: data.is_company,
		companyDescription: data.company_description,
		createdAt: data.created_at,
		updatedAt: data.updated_at,
	};

	return object;
}

function toDtoLogin(data) {
	const object = {
		id: data.id,
		name: data.name,
		email: data.email,
		image: data.image,
		location: data.location,
		isCompany: data.is_company,
		password: data.password,
		companyDescription: data.company_description,
		createdAt: data.created_at,
		updatedAt: data.updated_at,
	};

	return object;
}

module.exports = UserRepository;
