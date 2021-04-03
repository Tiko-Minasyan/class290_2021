const User = require('../users/user.entity');
const { Unauthorized, NotFound } = require('http-errors')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class AuthService {
    async validate(username, password) {
        let user = await User.findOne({ username });
        if (!user) {
            throw new NotFound('Username not found!');
        } else if(user.get('isLocked')) {
			throw new Error('User is locked!');
		} else if(!bcrypt.compareSync(password, user.password)) {
			const loginFails = user.get('loginFails');
			const update = {
				loginFails: loginFails + 1
			}
			if(loginFails + 1 >= 3) {
				update.isLocked = true;
			}
			user = Object.assign(user, update);
			user.save();
			if(user.get('isLocked')) throw new Error('The user is locked!');
			else throw new Error('Wrong password!');
		}

        return user;
    }

    async login(username, password) {
        let user = await this.validate(username, password);

        const token = jwt.sign({ userId: user._id, username: user.username }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN
        })

		user = Object.assign(user, {'loginFails': 0});
		user.save();

        return token;
    }

    validateToken(token) {
        const obj = jwt.verify(token, process.env.JWT_SECRET, {
            ignoreExpiration: false
        })

        return { userId: obj.userId, username: obj.username };
    }

	async isLocked(id) {
		const user = await User.findById(id).exec();
		return user.get('isLocked');
	}
}

module.exports = new AuthService();