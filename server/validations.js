import { body } from 'express-validator'


export const orderValidation = [
    body('email', 'invalid email!').isEmail(),
    body('phone', 'invalid phone').isMobilePhone().isLength({ min: 10 }),
    body('fio', 'invalid fio').matches(/^\s*(\S+\s+){2}\S+\s*$/, 'i')
]