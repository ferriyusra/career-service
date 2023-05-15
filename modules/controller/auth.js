const { EventEmitter } = require('events');
const createError = require('http-errors');
const messageConstant = require('../../config/messageConstant')
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const path = require('path');
const { ROOT_PATH, HASH_SYNC_NUMBER } = require('../../config/constant');
const bcrypt = require('bcryptjs');
const Auth = require('../../util/auth');

class AuthController extends EventEmitter {
	constructor(userService) {
		super();

		this.userService = userService;
	}

	async createUser(req, res, next) {
		try {
			const { name, email, location, companyDescription, password } = req.body;

			const user = await this.userService.getCompanyByNameOrEmail(name, email);
			if (user) {
				throw createError(
					StatusCodes.BAD_REQUEST,
					messageConstant.COMPANY_ALREADY_REGISTERED
				);
			}

			// hash password
			const hashPassword = bcrypt.hashSync(password, HASH_SYNC_NUMBER);

			// validate image
			if (!req.file) {
				throw createError(
					StatusCodes.BAD_REQUEST,
					messageConstant.FILE_REQUIRED
				);
			}

			const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];
			if (!allowedMimeTypes.includes(req.file.mimetype)) {
				throw createError(StatusCodes.BAD_REQUEST, messageConstant.INVALID_FILE);
			}

			if (req.file.size > 2000000) {
				// max 2MB
				throw createError(StatusCodes.BAD_REQUEST, messageConstant.SIZE_FILE_TOO_LARGE);
			}

			let tmp_path = req.file.path;
			let originalExt =
				req.file.originalname.split('.')[
				req.file.originalname.split('.').length - 1
				];
			let filename = req.file.filename + '.' + originalExt;
			let target_path = path.resolve(ROOT_PATH, `public/upload/user/${filename}`);

			const src = fs.createReadStream(tmp_path);
			const dest = fs.createWriteStream(target_path);
			src.pipe(dest);
			src.on('end', async () => {
				try {
					const user = await this.userService.createUser({
						name,
						email,
						location,
						company_description: companyDescription,
						password: hashPassword,
						image: filename,
					});

					res.success(toJobContract(user));
				} catch (err) {
					fs.unlinkSync(target_path);
					next(err);
				}
			});
			src.on('error', async () => {
				next(err);
			});
		} catch (error) {
			next(error);
		}
	}

	async login(req, res, next) {
		try {
			const { email, password } = req.body;

			const user = await this.userService.getUserCompany(email);
			const getPassword = user.password;

			const validatePassword = await Auth.validatePassword(password, getPassword);
			if (!validatePassword) {
				throw createError(
					StatusCodes.BAD_REQUEST,
					messageConstant.INCORRECT_PASSWORD
				);
			}

			if (!user) {
				throw createError(
					StatusCodes.BAD_REQUEST,
					messageConstant.FAILED_LOGIN
				);
			}

			const dataToken = {
				userId: user.id,
				name: user.name,
			}

			const token = Auth.generateToken(dataToken);

			res.success(toLoginContract(user, token));
		} catch (error) {
			next(error);
		}
	}

}

function toJobContract(data) {
	return {
		id: data.id,
		name: data.name,
		email: data.email,
		image: data.image,
		location: data.location,
		isCompany: data.isCompany,
		companyDescription: data.companyDescription,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	};
}

function toLoginContract(data, token) {
	return {
		userId: data.userId,
		name: data.name,
		email: data.email,
		image: data.image,
		token,
		createdAt: data.createdAt,
		updatedAt: data.updatedAt,
	}
}

module.exports = AuthController;
