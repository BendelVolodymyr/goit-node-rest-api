import { Schema, model } from 'mongoose';
import Joi from 'joi';
import { handleMongooseError } from '../middlewares/handleMongooseError.js';

const registerSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required()
    .label('Email')
    .messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .min(6)
    .pattern(new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$'))
    .required()
    .label('Password')
    .messages({
      'string.min': 'Password must be at least {#limit} characters long',
      'string.pattern.base':
        'Password must contain at least one digit, one lowercase and one uppercase letter',
      'any.required': 'Password is required',
    }),
  subscription: Joi.string()
    .valid('starter', 'pro', 'business')
    .default('starter')
    .label('Subscription'),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required()
    .label('Email')
    .messages({
      'string.email': 'Please enter a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .required()
    .min(6)
    .pattern(new RegExp('^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{6,}$'))
    .label('Password')
    .messages({
      'string.min': 'Password must be at least {#limit} characters long',
      'string.pattern.base':
        'Password must contain at least one digit, one lowercase and one uppercase letter',
      'any.required': 'Password is required',
    }),
});

const verificationTokenSchema = Joi.object({
  email: Joi.string()
    .required()
    .messages({ 'any.required': 'missing required field email' }),
});

const subscriptionSchema = Joi.object({
  subscription: Joi.string().valid('starter', 'pro', 'business').required(),
});

const usersSchema = new Schema(
  {
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
    },
    subscription: {
      type: String,
      enum: ['starter', 'pro', 'business'],
      default: 'starter',
    },
    token: {
      type: String,
      default: null,
    },
    avatarURL: {
      type: String,
      required: true,
    },
    verify: {
      type: Boolean,
      default: false,
    },
    verificationToken: {
      type: String,
      required: [true, 'Verify token is required'],
    },
  },
  { versionKey: false, timestamps: true }
);

usersSchema.post('save', handleMongooseError);

export const schemasUser = {
  registerSchema,
  loginSchema,
  subscriptionSchema,
  verificationTokenSchema,
};

export const User = model('users', usersSchema);
