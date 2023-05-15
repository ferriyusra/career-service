const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class Auth {
    constructor() {
        this.token = null;
    }

    setToken(token) {
        this.token = token;
    }

    getToken() {
        console.log(`get token ${this.token}`);
        return this.token;
    }

    generateToken(data) {
        return jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 20, // 20 days
                data,
            },
            process.env.AUTH_JWT_SECRET_CRM || process.env.TOKEN_KEY_CRM,
        );
    }

    generateLongLiveToken(data) {
        return jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * (30 * 12), // 1 year
                data,
            },
            process.env.AUTH_JWT_SECRET_CRM || process.env.TOKEN_KEY_CRM,
        );
    }

    generateRefreshToken(userId) {
        return jwt.sign(
            {
                exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 8, // 8 days
                data: {
                    userId,
                    refreshToken: true,
                },
            },
            process.env.AUTH_JWT_SECRET_CRM || process.env.TOKEN_KEY_CRM,
        );
    }

    verifyToken(token) {
        try {
            return jwt.verify(token, process.env.AUTH_JWT_SECRET_CRM || process.env.TOKEN_KEY_CRM);
        } catch (e) {
            console.log(e);
        }
    }

    async generatePassword(plainText) {
        const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS || 10));
        return await bcrypt.hash(plainText.toString(), salt);
    }

    async validatePassword(plainText, hash) {
        return await bcrypt.compare(plainText.toString(), hash.toString());
    }
}

module.exports = new Auth();
