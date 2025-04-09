import { body } from 'express-validator'


export const orderValidation = [
    body('email', 'invalid email!').isEmail(),
    body('phone', 'invalid phone').isMobilePhone(),
    body('fio', 'invalid fio').isLength({ min: 4 })
]