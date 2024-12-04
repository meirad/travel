import Joi from 'joi';

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,30}$/;

const UserSignup = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    password: Joi.string().pattern(passwordRegex).required(),
    isAdmin: Joi.boolean().required()
});

const UserLogin = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
});

export { UserSignup, UserLogin };