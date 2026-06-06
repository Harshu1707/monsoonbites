import { validationResult } from 'express-validator';

export const validate = (req, _res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next({ statusCode: 422, message: errors.array().map((error) => error.msg).join(', ') });
  }
  next();
};
