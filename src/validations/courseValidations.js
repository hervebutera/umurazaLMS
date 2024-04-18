import Joi from "joi"

export const createCourseValidationSchema = Joi.object({
    title: Joi.string().required().min(8).max(50),
    description: Joi.string().required().min(25),
    learning_mode: Joi.string().required(),
    min_age: Joi.number().required().min(0),
    max_age: Joi.number().required().min(0),
    expectations: Joi.object().required(),
    more_included: Joi.string().allow(""),
    priceInUSD: Joi.number().required().min(0),
    course_imageUrl: Joi.string().required(),
    repayment_interval: Joi.string().required(),

})

export const loginValidationSchema = Joi.object({
    email: Joi.string().required().lowercase().email(),
    password: Joi.string().required(),    
})
