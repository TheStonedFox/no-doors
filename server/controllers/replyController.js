import CommentModel from "../models/CommentModel.js"
import ReplyModel from "../models/ReplyModel.js"
import { setLikes } from "../utils/setLikes.js"

export const addReply = async (req, res) => {
    try {
        const reply = await new ReplyModel({ ...req.body })
        const doc = await reply.save()

        await CommentModel.findOneAndUpdate({ _id: req.body.commentId }, { $push: { replies: doc._id } })
        res.status(200).json({ message: 'Ответ отправлен.' })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}


export const getReply = async (req, res) => {
    try {
        const reply = await ReplyModel.findById(req.params.replyId)

        if (!reply)
            return res.status(404).json({ message: 'Ответ найден.22' })

        res.status(200).json({ message: 'Ответ найден.', reply })

    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}


export const editReply = async (req, res) => {
    try {
        const reply = await ReplyModel.findOneAndUpdate({ _id: req.params.replyId }, { ...req.body })

        if (!reply)
            return res.status(400).json({ message: 'Не удалось изменить ответ.' })

        res.status(200).json({ message: 'Ответ изменен.' })

    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

export const removeReply = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}


export const getAllReplies = async (req, res) => {
    try {
        const replies = await ReplyModel.find({ commentId: req.params.commentId })

        if (!replies)
            return res.status(404).json({ message: 'Ответ не найдено.1' })

        const sorted = replies.sort((a, b) => b.createdAt - a.createdAt)

        res.status(200).json({ message: 'Ответы получены.', replies: sorted })

    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

export const replyLike = (req, res) => setLikes(req, res, ReplyModel)

