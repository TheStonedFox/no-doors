import { validationResult } from "express-validator"

export const CheckValidation = async (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty())
        return res.status(400).json({ message: 'Ошибка валидации. Проверьте указанные поля.', code: 400, validationErrors: errors.errors })
    next()
}