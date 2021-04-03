const express = require('express');
const router = express.Router();
const users = require('./users.service');
const asyncHandler = require('express-async-handler');

router.patch('/unlock-user/:id', asyncHandler(async (req, res) => {
	const {id} = req.params;
	await users.unlock(id, req.user);
	res.status(200).json({message: 'User has successfully been unlocked!'});
}))

router.patch('/lock-user/:id', asyncHandler(async (req, res) => {
	const {id} = req.params;
	await users.lock(id, req.user);
	res.status(200).json({message: 'User has successfully been locked!'});
}))

module.exports = router;
