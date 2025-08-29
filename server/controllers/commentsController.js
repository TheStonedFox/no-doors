import { body } from "express-validator"
import CommentModel from "../models/CommentModel.js"
import ProductModel from "../models/ProductModel.js"
import { setLikes } from "../utils/setLikes.js"

export const addComment = async (req, res) => {

    const comment = await new CommentModel({ ...req.body })

    const product = await ProductModel.findById(req.body.productId)

    if (!product)
        return res.status(404).json({ message: 'Товар не найден.', code: 404 })

    req.body.type === 'review' && await ProductModel.updateOne(
        { _id: req.body.productId },
        {
            $inc: {
                ratingValue: +req.body.ratingValue,
                [`starsValues.${req.body.ratingValue}`]: 1
            },
        })

    await comment.save()

    res.status(200).json({ message: `${req.body.type === 'review' ? 'Отзыв отправлен.' : 'Вопрос отправлен.'}`, code: 200 })

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
        const comment = await CommentModel.findById(req.params.commentId)

        const updatedComment = await CommentModel.updateOne(
            { _id: req.params.commentId },
            { $set: { text: req.body.text, ratingValue: req.body.ratingValue }, $push: { editHistory: { text: comment.text, ratingValue: comment.ratingValue } } },
        )
        if (!updatedComment) return res.status(404).json({ message: 'Коммент не найден', code: 404 })


        if (comment.text === req.body.text)
            return res.status(404).json({ message: 'Комментарий не был изменен.', code: 404 })

        comment.ratingValue !== req.body.ratingValue && await ProductModel.findOneAndUpdate({ _id: updatedComment.productId },
            {
                $inc: {
                    [`starsValues.${comment.ratingValue}`]: -1,
                    [`starsValues.${req.body.ratingValue}`]: +1,
                    ratingValue: + (req.body.ratingValue - comment.ratingValue),
                }
            })

        res.status(200).json({ message: 'Коммент обновлен.', code: 200 })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

export const likeComment = (req, res) => setLikes(req, res, CommentModel)

