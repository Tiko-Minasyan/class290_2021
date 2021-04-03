const { Forbidden, Locked } = require('http-errors');
const { validateToken, isLocked } = require('../../auth/auth.service');
const users = require('../../users/users.service');

const jwtMiddleware = async (req, res, next) => {
    let token;
    try {
        token = req.header('Authorization').split(' ')[1];
        const user = validateToken(token);
		if(await isLocked(user.userId)) {
			throw new Error('locked')
		}
        const dbUser = await users.findOne(user.userId);
        user.role = dbUser.role;
        req.user = user;
    } catch (err) {
		if(err.message.includes('locked')) return next(new Locked('The user is locked!'));
        else return next(new Forbidden());
    }

    next();
}

jwtMiddleware.unless = require('express-unless');

module.exports = {
    jwtMiddleware
}