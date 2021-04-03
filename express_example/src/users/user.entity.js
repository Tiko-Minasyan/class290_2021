const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const ADMIN_ROLE = require('../commons/util').ADMIN_ROLE;
const CUSTOMER_ROLE = require('../commons/util').CUSTOMER_ROLE;

const Schema = mongoose.Schema;

const schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
		minlength: 4,
    },

    password: {
        type: String,
        required: true,
    },

    firstName: {
        type: String,
        required: true,
		trim: true,
    },

    lastName: {
        type: String,
        required: true,
		trim: true,
    },

    role: {
        type: String,
		required: true,
		enum: [CUSTOMER_ROLE, ADMIN_ROLE],
		default: CUSTOMER_ROLE,
    },

	loginFails: {
		type: Number,
		default: 0,
	},

	isLocked: {
		type: Boolean,
		default: false,
	}
}, { collection: 'users' });

schema.pre('save', function (next) {
    if (this.isModified('password')) {
        const salt = bcrypt.genSaltSync();
        this.password = bcrypt.hashSync(this.password, salt);
    }

    next();
})

module.exports = mongoose.model('User', schema);