import styles from './Comment.module.css'

import ReviewStars from '../ReviewStars/ReviewStars'

import { GoReply } from 'react-icons/go'
import { CiEdit } from "react-icons/ci"
import { RiDeleteBin6Line } from "react-icons/ri"

import { BiLike } from 'react-icons/bi'
import { BiDislike } from 'react-icons/bi'

import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { getComment, getReply, getUserInfo, likeComment, likeReply } from '../../api/api'
import { addNotification, togglePopup } from '../../redux/features/uiSlice'

import AvatarIcon from '../../svg/AvatarIcon'
import HistoryItem from './HistoryItem/HistoryItem'
import SkeletonLadingShimmer from '../../components/SkeletonLadingShimmer/SkeletonLadingShimmer'
import EmptyPlaceholder from '../../components/EmptyPlaceholder/EmptyPlaceholder'

export default function Comment({ commentData, type }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userData = useSelector((state) => state.user.userData)
    const isLogged = useSelector(state => state.user.isTokenValid)

    const [comment, setComment] = useState(commentData)
    const [userInfo, setUserInfo] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const [isLikesUpdating, setIsLikesUpdating] = useState(false)


    const { text, userId: commentUserId, ratingValue, createdAt, likes, dislikes, _id: documentId, type: commentType, editHistory, commentId } = comment || {}

    const { _id: currentUser } = userData || {}
    const { avatar, fio: userName } = userInfo || {}
    const date = new Date(createdAt)

    const idCommentToUpdate = useSelector(state => state.shared.idCommentToUpdate)

    useEffect(() => {
        if (!documentId) return
        idCommentToUpdate === documentId && refreshComment()
    }, [idCommentToUpdate])

    const refreshComment = (onlyLikes) => {
        setError(null)
        if (onlyLikes) setIsLikesUpdating(true)
        else setIsLoading(true)

        type !== 'reply' &&
            getComment(documentId).then(res => setComment(res.comment))
                .catch(error => setError(error))
                .finally(() => {
                    if (onlyLikes) setIsLikesUpdating(false)
                    else setIsLoading(false)
                })
        type === 'reply' &&
            getReply(documentId)
                .then(res => setComment(res.reply))
                .catch(error => setError(error))
                .finally(() => {
                    if (onlyLikes) setIsLikesUpdating(false)
                    else setIsLoading(false)
                })
    }

    useEffect(() => {
        getUserInfo(commentUserId)
            .then(res => setUserInfo({ ...res }))
            .catch(error => console.log(error))
    }, [])


    const onCommentClick = (e) => {
        e.stopPropagation()
        !isPreviewMode && type !== 'reply' && navigate(`/comments/${documentId}`)
    }

    const onReplyButtonClick = (e) => {
        e.stopPropagation()
        if (!isLogged)
            return dispatch(addNotification({ type: 'info', text: 'Чтобы совершить это действие, нужно войти в аккаунт.', route: 'auth' }))
        dispatch(togglePopup({ type: 'reply', data: { commentId: documentId, userName: userName.split(' ')[0], userId: userData?._id } }))
    }

    const onEditButtonClick = (e) => {
        e.stopPropagation()
        if (type !== 'reply' && commentType === 'review')
            dispatch(togglePopup({ type: 'update-review', data: { commentId: documentId } }))

        if (type !== 'reply' && commentType === 'question')
            dispatch(togglePopup({ type: 'edit-question', data: { commentId: documentId } }))

        if (type === 'reply')
            dispatch(togglePopup({ type: 'edit-reply', data: { replyId: documentId } }))
    }

    const onLikeButtonClick = (method, e) => {
        e.stopPropagation()
        if (!isLogged)
            return dispatch(addNotification({ type: 'info', text: 'Чтобы совершить это действие, нужно войти в аккаунт.', route: 'auth' }))

        type !== 'reply' && likeComment(documentId, { method, userId: userData?._id })
            .then(() => refreshComment(true))
            .catch(error => dispatch(addNotification({ type: 'error', text: error.message })))

        type === 'reply' && likeReply(documentId, { method, userId: userData?._id })
            .then(() => refreshComment(true))
            .catch(error => dispatch(addNotification({ type: 'error', text: error.message })))

    }

    const onRemoveButtonClick = (e) => {
        e.stopPropagation()
        dispatch(togglePopup({ type: 'remove-comment', data: { commentType: commentType || type, documentId: documentId, commentId: commentId } }))
    }

    const [historyVisible, setHistoryVisible] = useState(true)

    const isPreviewMode = window.location.pathname.includes(documentId)

    return !isLoading ? (
        <article
            className={styles['comment']}
            style={{ border: isPreviewMode && 0, maxHeight: isPreviewMode ? '100%' : '250px' }}
            onClick={onCommentClick}>
            {!isLoading && !error && <section className={styles['comment__header']}>
                <section className={styles['header__right-box']}>
                    <div>
                        {avatar?.url ? <img className='' src={avatar.url} alt="" /> : <AvatarIcon />}
                        <section className={styles['right-box__name-section']}>
                            <h3>{commentUserId !== currentUser ? userName : 'Вы'}</h3>
                            {commentType === 'review' && <p>Отзыв от покупателя</p>}
                        </section>
                    </div>
                    {commentType === 'review' && <ReviewStars ratingValue={ratingValue} />}
                </section>
                <p className={styles['comment__date']}>{new Date(Date.now()).getDay() === date.getDay() ? `${date.getHours()}:${date.getMinutes()}`
                    : date.toLocaleDateString()}</p>
            </section>}

            {!isLoading && !error && <section className={styles['comment__text']}>
                <p className={!isPreviewMode ? styles['clamp'] : null}>{text}</p>
            </section>}

            {Boolean(isPreviewMode && editHistory.length && historyVisible) && <h3>История обновлений:</h3>}
            {Boolean(isPreviewMode && editHistory.length && historyVisible) && <section className={styles['comment__edit-history']}
                style={{ height: isPreviewMode && historyVisible ? '100%' : '0', transition: '0.2s' }}>

                {editHistory?.map(editItem => <HistoryItem key={editItem._id} data={editItem} />)}
            </section>}

            {!isLoading && !error && <section className={styles['comment__footer']}>
                <section className={styles['user-actions-buttons']}>
                    {currentUser !== commentUserId && type !== 'reply' &&
                        <GoReply style={{ transform: 'rotate(180deg)', width: '20px' }}
                            className={styles['footer__comment-button']}
                            onClick={onReplyButtonClick} />}

                    {currentUser === commentUserId && <CiEdit
                        className={styles['footer__comment-button']}
                        style={{ width: '20px' }}
                        onClick={onEditButtonClick} />}
                    <section className={styles['actions-buttons__left-box']}>

                        {currentUser !== commentUserId && <section className={styles['footer__likes-buttons']}>
                            {!isLikesUpdating && <div className={styles['footer__comment-button']}
                                style={likes?.includes(currentUser) ? { color: 'var(--ui---main)' } : {}}>
                                <BiLike onClick={(e) => onLikeButtonClick('like', e)} />
                                <p>{likes?.length ? likes?.length : ''}</p>
                            </div>}

                            {!isLikesUpdating && <div className={styles['footer__comment-button']}
                                style={dislikes?.includes(currentUser) ? { color: 'var(--ui---main)' } : {}}>
                                <BiDislike onClick={(e) => onLikeButtonClick('dislike', e)} />
                                <p>{dislikes?.length ? dislikes?.length : ''}</p>
                            </div>}
                        </section>}

                        {currentUser === commentUserId && commentType !== 'review' && <RiDeleteBin6Line
                            className={styles['footer__comment-remove-button']} onClick={onRemoveButtonClick} />}

                        {Boolean(comment?.replies?.length && !window.location.pathname.includes(documentId)) &&
                            <p onClick={() => navigate(`/comments/${documentId}`)}>Ответы ({comment?.replies.length})</p>}

                        {/* {!isPreviewMode && commentType === 'review' && comment?.replies.length && editHistory.length ? '|' : ''} */}
                        {Boolean(commentType === 'review' && editHistory.length && isPreviewMode) &&
                            <p onClick={(e) => {
                                e.stopPropagation()
                                setHistoryVisible(!historyVisible)
                            }}>{historyVisible ? 'Скрыть историю' : 'Показать историю'}</p>}
                    </section>

                </section>
            </section>}

            {!isLoading && error && <EmptyPlaceholder title='Не удалось загрузить данные' />}
        </article >
    ) : <SkeletonLadingShimmer style={{ width: '100%', height: commentType === 'review' ? 152 : 121 }} />
}
