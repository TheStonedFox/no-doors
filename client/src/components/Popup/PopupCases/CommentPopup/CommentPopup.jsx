
import styles from './CommentPopup.module.css'

import { IoIosStar } from "react-icons/io"
import Button from '../../../Button/Button'

import { useEffect, useState } from 'react'
import { addComment, editComment, getComment } from '../../../../api/api'
import { useDispatch, useSelector } from 'react-redux'
import { addNotification, togglePopup } from '../../../../redux/features/uiSlice'
import { setIdCommentToUpdate } from '../../../../redux/features/sharedSlice'

export default function CommentPopup({ type, productId, commentId }) {
    const dispatch = useDispatch()

    const [commentData, setCommentData] = useState({ text: null, ratingValue: null })
    const [rating, setRating] = useState(0)
    const [isRatingChoose, setIsRatingChoose] = useState(false)

    useEffect(() => setCommentData(prev => ({ ...prev, ratingValue: rating })), [rating])
    const { _id, fio } = useSelector(state => state.user.userData)

    useEffect(() => {
        if (type === 'update-review' || type === 'edit-question')
            getComment(commentId).then(res => setCommentData(res.comment)).catch(error => console.log(error))
    }, [commentId, type])

    const onSuccessSubmit = (text) => {
        dispatch(addNotification({ type: 'success', text: text }))
        dispatch(setIdCommentToUpdate(commentId))
        dispatch(togglePopup())
    }

    const onSubmitCommentButtonClick = () => {
        if (!commentData.text) return dispatch(addNotification({ type: 'error', text: 'Поле с тексом обязательно для заполнения.' }))
        if ((!isRatingChoose || rating === 0) && (type === 'review' || type === 'update-review'))
            return dispatch(addNotification({ type: 'error', text: 'Вы должны поставить свою оценку, перед отправкой отзыва' }))

        dispatch(setIdCommentToUpdate(null))

        type === 'review' && addComment({ ...commentData, type, userId: _id, productId, userName: fio })
            .then(res => onSuccessSubmit(res.message))
            .catch(error => dispatch(addNotification({ type: 'error', text: error.message })))

        type === 'update-review' && editComment(commentId, { ...commentData })
            .then(res => onSuccessSubmit(res.message))
            .catch(error => dispatch(addNotification({ type: 'error', text: error.message })))


        type === 'question' && addComment({ text: commentData.text, type, userId: _id, productId, userName: fio })
            .then(res => onSuccessSubmit(res.message))
            .catch(error => dispatch(addNotification({ type: 'error', text: error.message })))

        type === 'edit-question' && editComment(commentId, { text: commentData.text })
            .then(res => onSuccessSubmit(res.message))
            .catch(error => dispatch(addNotification({ type: 'error', text: error.message })))

        dispatch(setIdCommentToUpdate(null))
    }

    const submitButtonTitles = {
        'question': 'Задать вопрос',
        'edit-question': 'Изменить',
        'review': 'Отправить отзыв',
        'update-review': 'Изменить отзыв',
    }

    return (
        <div className={styles['add-comment-popup']}>
            <h3>{submitButtonTitles[type]}</h3>
            <textarea
                placeholder='Напишите текст тут.'
                className={styles['add-comment-popup__text']}
                value={commentData?.text}
                onChange={(value) => setCommentData(prev => ({ ...prev, text: value.target.value }))}
            ></textarea>
            {type === 'review' || type === 'update-review' ? <p>Оцените товар</p> : null}
            {type === 'review' || type === 'update-review' ? <section className={styles['add-comment-popup__choose-rating']}>
                <IoIosStar
                    style={rating >= 1 ? { color: 'var(--ui---stars)', transition: '0.2s' } : {}}
                    onMouseEnter={() => !isRatingChoose && setRating(1)}
                    onMouseLeave={() => !isRatingChoose && setRating(0)}
                    onClick={() => setIsRatingChoose(!isRatingChoose)} />

                <IoIosStar
                    style={rating >= 2 ? { color: 'var(--ui---stars)', transition: '0.2s' } : {}}
                    onMouseEnter={() => !isRatingChoose && setRating(2)}
                    onMouseLeave={() => !isRatingChoose && setRating(0)}
                    onClick={() => setIsRatingChoose(!isRatingChoose)} />
                <IoIosStar
                    style={rating >= 3 ? { color: 'var(--ui---stars)', transition: '0.2s' } : {}}
                    onMouseEnter={() => !isRatingChoose && setRating(3)}
                    onMouseLeave={() => !isRatingChoose && setRating(0)}
                    onClick={() => setIsRatingChoose(!isRatingChoose)} />
                <IoIosStar
                    style={rating >= 4 ? { color: 'var(--ui---stars)', transition: '0.2s' } : {}}
                    onMouseEnter={() => !isRatingChoose && setRating(4)}
                    onMouseLeave={() => !isRatingChoose && setRating(0)}
                    onClick={() => setIsRatingChoose(!isRatingChoose)} />

                <IoIosStar
                    style={rating >= 5 ? { color: 'var(--ui---stars)', transition: '0.2s' } : {}}
                    onMouseEnter={() => !isRatingChoose && setRating(5)}
                    onMouseLeave={() => !isRatingChoose && setRating(0)}
                    onClick={() => setIsRatingChoose(!isRatingChoose)} />

            </section> : null}

            <Button className={styles['submit-comment-button']}
                title={submitButtonTitles[type]}
                onClick={onSubmitCommentButtonClick} />
        </div>
    )
}
