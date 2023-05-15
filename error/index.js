class RecordNotFoundError extends Error {
	constructor() {
		super('Record not found.');
		this.name = this.constructor.name;

		Error.captureStackTrace(this, this.constructor);
	}

	get statusCode() {
		return 404;
	}
}

class DatabaseUniqueViolationError extends Error {
	constructor() {
		super('Unique violation error.');
		this.name = this.constructor.name;

		Error.captureStackTrace(this, this.constructor);
	}

	get statusCode() {
		return 409;
	}
}

class CsvParsingError extends Error {
	constructor(message) {
		super();
		this.name = this.constructor.name;
		this.message = `CSV parsing error - ${message}`;
	}

	get statusCode() {
		return 400;
	}
}

class ValidationError extends Error {
	constructor(message = 'Validation error') {
		super(message);
		this.name = this.constructor.name;

		Error.captureStackTrace(this, this.constructor);
	}
}


module.exports = {
	DatabaseUniqueViolationError,
	RecordNotFoundError,
	CsvParsingError,
	ValidationError
};
