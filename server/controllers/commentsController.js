import CommentModel from "../models/CommentModel.js"
import ProductModel from "../models/ProductModel.js"
import { setLikes } from "../utils/setLikes.js"
import ReplyModel from "../models/ReplyModel.js"

export const addComment = async (req, res) => {

    const comment = await new CommentModel({ ...req.body })

    const product = await ProductModel.findById(req.body.productId)

    if (!product)
        return res.status(404).json({ message: 'Товар не найден.' })

    req.body.type === 'review' && await ProductModel.updateOne(
        { _id: req.body.productId },
        {
            $inc: {
                ratingValue: +req.body.ratingValue,
                [`starsValues.${req.body.ratingValue}`]: 1
            },
        })

    await comment.save()

    res.status(200).json({ message: `${req.body.type === 'review' ? 'Отзыв отправлен.' : 'Вопрос отправлен.'}` })

}
export const getComment = async (req, res) => {
    try {
        const comment = await CommentModel.findById(req.params.commentId)

        if (!comment)
            return res.status(404).json({ message: `Комментарий не найден.` })

        res.status(200).json({ comment })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

export const editComment = async (req, res) => {
    try {
        const { commentId } = req.params
        const { text, ratingValue } = req.body

        const comment = await CommentModel.findById(commentId)
        if (!comment) {
            return res.status(404).json({ message: 'Коммент не найден' })
        }

        if (comment.type === 'question') {
            await CommentModel.updateOne(
                { _id: commentId },
                {
                    $set: { text }
                },
            )
            return res.status(200).json({ message: 'Вопрос изменен.' })
        }

        if (comment.text === text && comment.ratingValue === ratingValue) {
            return res.status(400).json({ message: 'Комментарий не был изменен.' })
        }

        const updatedComment = await CommentModel.findByIdAndUpdate(
            commentId,
            {
                $set: { text, ratingValue },
                $push: {
                    editHistory: {
                        text: comment.text,
                        ratingValue: comment.ratingValue,
                        editedAt: new Date()
                    }
                }
            },
            { new: true }
        )

        if (comment.ratingValue !== ratingValue) {
            await ProductModel.findByIdAndUpdate(
                updatedComment.productId,
                {
                    $inc: {
                        [`starsValues.${comment.ratingValue}`]: -1,
                        [`starsValues.${ratingValue}`]: +1,
                        ratingValue: ratingValue - comment.ratingValue
                    }
                }
            )
        }

        res.status(200).json({ message: 'Коммент обновлен.', updatedComment })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}


export const likeComment = (req, res) => setLikes(req, res, CommentModel)

export const removeComment = async (req, res) => {
    try {
        const type = req.query.type
        if (type === 'question') {
            const commentId = req.params.commentId

            const comment = await CommentModel.findByIdAndDelete(commentId)

            if (!comment)
                return res.status(404).json({ message: 'Вопрос не найден.' })

            res.status(200).json({ message: 'Вопрос удален.' })
        }

        if (type === 'reply') {
            const replyId = req.params.commentId

            const reply = await ReplyModel.findById(replyId)

            if (!reply)
                return res.status(404).json({ message: 'Ответ не найден.' })

            const updatedComment = await CommentModel.updateOne({ _id: reply.commentId }, { $pull: { replies: reply._id } })

            if (updatedComment.modifiedCount === 0) {
                return res.status(400).json({ message: 'Не удалось обновить комментарий при удалении ответа.' })
            }

            await ReplyModel.deleteOne({ _id: replyId })

            res.status(200).json({ message: 'Ответ удален.' })
        }

    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

export const getAllReplies = async (req, res) => {
    try {
        const replies = await ReplyModel.find({ commentId: req.params.commentId }).sort({ createdAt: -1 })

        if (!replies.length)
            return res.status(200).json({ message: 'Ответов не нет.', replies })

        res.status(200).json({ message: 'Ответы получены.', replies })

    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

