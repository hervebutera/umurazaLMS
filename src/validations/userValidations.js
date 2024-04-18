import Joi from "joi"

export const signupValidationSchema = Joi.object({
    firstname: Joi.string().trim().required().min(2).max(255),
    lastname: Joi.string().required().min(2).max(255),
    email: Joi.string().required().lowercase().email(),
    password: Joi.string().required().min(6),
    phone: Joi.string(),
    birthdate: Joi.date().iso().max('now').min('1900-01-01').required()
})

export const loginValidationSchema = Joi.object({
    email: Joi.string().required().lowercase().email(),
    password: Joi.string().required(),    
})

export const resetPasswordValidationSchema = Joi.object({
    password: Joi.string().required().min(6)
})
