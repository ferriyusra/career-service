const { EventEmitter } = require('events');
const createError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const { ROOT_PATH, HASH_SYNC_NUMBER } = require('../../config/constant');
const messageConstant = require('../../config/messageConstant');
const Auth = require('../../util/auth');

class AuthController extends EventEmitter {
  constructor(userService) {
    super();

    this.userService = userService;
  }

  async createUser(req, res, next) {
    try {
      const {
        name, email, location, companyDescription, password,
      } = req.body;

      const user = await this.userService.getCompanyByNameOrEmail(name, email);
      if (user) {
        throw createError(
          StatusCodes.BAD_REQUEST,
          messageConstant.COMPANY_ALREADY_REGISTERED,
        );
      }

      // hash password
      const hashPassword = bcrypt.hashSync(password, HASH_SYNC_NUMBER);

      // validate image
      if (!req.file) {
        throw createError(
          StatusCodes.BAD_REQUEST,
          messageConstant.FILE_REQUIRED,
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

      const tmpPath = req.file.path;
      const originalExt =
        req.file.originalname.split('.')[
        req.file.originalname.split('.').length - 1
        ];
      const filename = `${req.file.filename}.${originalExt}`;
      const targetPath = path.resolve(ROOT_PATH, `public/upload/user/${filename}`);

      const src = fs.createReadStream(tmpPath);
      const dest = fs.createWriteStream(targetPath);
      src.pipe(dest);
      src.on('end', async () => {
        try {
          const createdUser = await this.userService.createUser({
            name,
            email,
            location,
            companyDescription,
            password: hashPassword,
            image: filename,
          });

          res.success(toJobContract(createdUser));
        } catch (err) {
          fs.unlinkSync(targetPath);
          next(err);
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      const user = await this.userService.getUserCompany(email);
      if (!user) {
        throw createError(
          StatusCodes.BAD_REQUEST,
          messageConstant.FAILED_LOGIN,
        );
      }

      const getPassword = user.password;

      const validatePassword = await Auth.validatePassword(password, getPassword);
      if (!validatePassword) {
        throw createError(
          StatusCodes.BAD_REQUEST,
          messageConstant.INCORRECT_PASSWORD,
        );
      }

      const dataToken = {
        userId: user.id,
        name: user.name,
      };

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
  };
}

module.exports = AuthController;
