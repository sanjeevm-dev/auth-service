import Joi from "joi";

// Define validation schemas
export const userValidationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
  designation: Joi.string().valid("dr", "user", "admin").required().messages({
    "any.only": "Designation must be one of [dr, user, admin].",
    "string.empty": "Designation is required.",
  }),
});

export const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(30).required(),
});

export const passwordSchema = Joi.object({
  password: Joi.string().min(6).max(50).required(),
});
