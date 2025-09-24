import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

import { validationResult } from "express-validator"

import UserModel from "../models/UserModel.js"

import { checkCaptcha } from '../utils/checkCaptcha.js'
import { sendEmail } from "../utils/sendEmail.js"

import UtilityListsModel from "../models/UtilityListsModel.js"
import { type } from 'os'
import { confirmEmailTemplate } from '../confirmEmailTemplate.js'
import { resetPasswordEmailTemplate } from '../resetPasswordEmailTemplate.js'

export const register = async (req, res) => {
    try {
        const errors = validationResult(req)

        if (!errors.isEmpty())
            return res.status(400).json({ message: 'Ошибка валидации. Проверьте указанные поля.', validationErrors: errors.errors })

        const captchaStatus = await checkCaptcha(req.body.reCaptchaToken)

        const isUser = await UserModel.findOne({ email: req.body.email })

        if (isUser)
            return res.status(400).json({ message: 'Email уже используется.', })

        if (!captchaStatus && req.body.emailConfirmCode)
            return res.status(401).json({ message: 'Капча не пройдена.', })

        const utilityLists = await UtilityListsModel.findOne()

        if (!req.body.emailConfirmCode) {
            const generatedCode = Math.random().toFixed(5).replace('.', '')

            await utilityLists.updateOne({ $push: { emailConfirmedCodes: { email: req.body.email, code: generatedCode, expires: Date.now() + 5 * 60 * 1000 } } })

            await sendEmail(req.body.email, 'Подтверждение электронной почты', confirmEmailTemplate(generatedCode))
            return res.status(202).json({ message: 'Регистрация не завершена полностью.', code: 202 })
        }

        const emailCodes = await utilityLists.emailConfirmedCodes
        const code = emailCodes.find(item => item.code === req.body.emailConfirmCode)

        if (!code)
            return res.status(400).json({ message: 'Код указан не верно.', code: 400 })

        utilityLists.emailConfirmedCodes.filter(code => code.expires > Date.now())

        await utilityLists.save()
        if (code.expires < Date.now())
            return res.status(400).json({ message: 'Срок действия кода истек.', })

        utilityLists.emailConfirmedCodes = utilityLists.emailConfirmedCodes.filter(c => c.expires > Date.now())

        await utilityLists.save()

        const slat = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(req.body.password, slat)

        const doc = await new UserModel({ fio: req.body.fio, phone: req.body.phone, email: req.body.email, password: passwordHash })

        await doc.save()

        res.status(200).json({ message: 'Регистрация завершена.' })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email })

        if (!user)
            return res.status(400).json({ message: 'Не верные данные для входа.' })

        const isValidPassword = await bcrypt.compare(req.body.password, user.password)

        if (!isValidPassword)
            return res.status(400).json({ message: 'Не верные данные для входа.' })

        if (req.body.isCaptchaNeed) {
            const captchaStatus = await checkCaptcha(req.body.reCaptchaToken)

            if (!captchaStatus)
                return res.status(401).json({ message: 'Капча не пройдена.' })
        }

        const token = await jwt.sign({ id: user._id }, process.env.JWT_WORD)

        res.status(200).json({ token, message: `Добро пожаловать, ${user.fio.split(' ')[0]}` })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

export const resetPassword = async (req, res) => {
    try {
        const errors = validationResult(req)

        if (errors.errors.find(error => error.path === 'email'))
            return res.status(400).json({ message: 'Введите корректный email.', validationErrors: errors.errors })

        const user = await UserModel.findOne({ email: req.body.email })

        if (!user)
            return res.status(404).json({ message: 'Пользователя с таким email не найдено.' })

        const token = crypto.randomBytes(32).toString("hex")
        const expires = Date.now() + 5 * 60 * 1000

        const utilityLists = await UtilityListsModel.findOne()

        await utilityLists.updateOne({ $push: { resetPasswordTokens: { user: user._id, token, expires } } })

        await sendEmail(req.body.email, 'Восстановление пароля', resetPasswordEmailTemplate(`${process.env.API_URL}/auth/reset-password?token=${token}`))

        res.status(200).json({ message: 'Ссылка для восстановления пароля выслана на почту.' })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }

}

export const checkLink = async (req, res) => {
    try {

        const utilityLists = await UtilityListsModel.findOne()

        const tokensList = await utilityLists.resetPasswordTokens

        const tokenItem = tokensList.find(token => token.token === req.query.token)

        if (!tokenItem) return res.status(404).json({ message: `Ссылка не действительна или уже была использована.`, })

        if (tokenItem.expires < Date.now()) {
            await UtilityListsModel.updateOne({}, { $pull: { resetPasswordTokens: tokenItem } })
            return res.status(400).json({ message: 'Время действия ссылки истекло.' })
        }

        res.status(200).json({ message: 'Ссылка действительна.', token: tokenItem.token })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

export const updatePassword = async (req, res) => {
    try {
        const errors = validationResult(req)

        if (errors.errors.find(error => error.path === 'password'))
            return res.status(400).json({ message: 'Пароль не соответствует требованиям.', validationErrors: errors.errors })

        const utilityLists = await UtilityListsModel.findOne()

        const tokensList = await utilityLists.resetPasswordTokens

        const tokenItem = tokensList.find(token => token.token === req.body.token)

        const salt = await bcrypt.genSalt(5)
        const passwordHash = await bcrypt.hash(req.body.password, salt)

        const user = await UserModel.findOneAndUpdate(
            { _id: tokenItem.user },
            { $set: { password: passwordHash } },
        )

        if (!user) return res.status(400).json({ message: 'Не удалось обновить данные.' })

        await UtilityListsModel.updateOne({}, { $pull: { resetPasswordTokens: tokenItem } })

        res.status(200).json({ message: 'Пароль успешно изменен.' })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

export const removeCodes = async (req, res) => {
    try {
        const utilityLists = await UtilityListsModel.findOne()
        const emailCodes = await utilityLists.emailConfirmedCodes
        emailCodes.map(async (i) => i.email === req.body.email && await UtilityListsModel.updateOne({}, { $pull: { emailConfirmedCodes: i } }))

        res.status(200).json({ message: 'Коды удалены' })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}
