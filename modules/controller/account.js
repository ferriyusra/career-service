const { EventEmitter } = require('events');
const createError = require('http-errors');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs');
const path = require('path');
const { ROOT_PATH } = require('../../config/constant');
const messageConstant = require('../../config/messageConstant');

class AccountController extends EventEmitter {
  constructor(userService) {
    super();

    this.userService = userService;
  }

  async upateAccount(req, res, next) {
    try {
      const userId = req.user.id;
      const {
        name,
        location,
        companyDescription,
      } = req.body;

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
          const user = await this.userService.getCompanyById(userId);

          const currentImage = path.resolve(ROOT_PATH, `public/upload/user/${user.image}`);
          if (fs.existsSync(currentImage)) {
            fs.unlinkSync(currentImage);
          }

          const updatedUser = await this.userService.updateUser(userId, {
            name,
            location,
            companyDescription,
            image: filename,
          });

          res.success(toAccountContract(updatedUser));
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

function toAccountContract(data) {
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

module.exports = AccountController;
