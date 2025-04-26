import { body } from 'express-validator'


export const orderValidation = [
    body('email', 'invalid email!').isEmail(),
    body('phone', 'invalid phone').isMobilePhone().isLength({ min: 10 }),
    body('fio', 'invalid fio').matches(/^\s*(\S+\s+){2}\S+\s*$/, 'i'),
    body('address')
        .if((value, { req }) => req.body.deliveryMethod === 'delivery') // Условие
        .isLength({ min: 5 }).withMessage('invalid address') // Если условие выполнено — валидируем
]


export const registerValidation = [
    body('email', 'invalid email!').isEmail(),
    body('phone', 'invalid phone').isMobilePhone().isLength({ min: 10 }),
    body('fio', 'invalid fio').matches(/^\s*(\S+\s+){2}\S+\s*$/, 'i'),
    body('password', 'invalid password').isLength({ min: 8 })
]


export const profileInfoValidation = [
    body('email', 'invalid email!').isEmail(),
    body('phone', 'invalid phone').isMobilePhone().isLength({ min: 10 }),
]
