import styles from './Comment.module.css'

import ReviewStars from '../ReviewStars/ReviewStars'

import { GoReply } from 'react-icons/go'
import { CiEdit } from "react-icons/ci"
import { RiDeleteBin6Line } from "react-icons/ri"

import { BiLike } from 'react-icons/bi'
import { BiDislike } from 'react-icons/bi'

import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { addReply, editComment, editReply, getComment, getReply, getUserInfo, likeComment, likeReply } from '../../api/api'

import AvatarIcon from '../../svg/AvatarIcon'
import { addNotification, togglePopup } from '../../redux/features/uiSlice'
import { setIdCommentToUpdate } from '../../redux/features/sharedSlice'
import HistoryItem from './HistoryItem/HistoryItem'

import SkeletonLadingShimmer from '../../components/SkeletonLadingShimmer/SkeletonLadingShimmer'



export default function Comment({ commentData, type }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const userData = useSelector((state) => state.user.userData)

    const [comment, setComment] = useState(commentData)
    const [userInfo, setUserInfo] = useState()
    const [isLoading, setIsLoading] = useState(false)


    const { text, userId: commentUserId, ratingValue, createdAt, likes, dislikes, _id: commentId, type: commentType, editHistory } = comment || {}
    const { _id: currentUser } = userData || {}
    const { avatarUrl, fio: userName } = userInfo || {}
    const date = new Date(createdAt)

    const idCommentToUpdate = useSelector(state => state.shared.idCommentToUpdate)

    useEffect(() => refreshComment(), [idCommentToUpdate])
    // useEffect(() => alert('ss'), [idCommentToUpdate])

    const refreshComment = () => {
        type !== 'reply' &&
            getComment(commentId).then(res => {
                setComment(res.comment)
            })
                .catch(error => console.log(error))
        type === 'reply' &&
            getReply(commentId).then(res => {
                setComment(res.reply)
            })
                .catch(error => console.log(error))
    }

    useEffect(() => {
        getUserInfo(commentUserId)
            .then(res => setUserInfo({ ...res }))
            .catch(error => console.log(error))
    }, [])

    const isLogged = useSelector(state => state.user.isTokenValid)

    const onCommentClick = (e) => {
        e.stopPropagation()
        !isPreviewMode && type !== 'reply' && navigate(`/comments/${commentId}`)
    }


    const onReplyButtonClick = (e) => {
        e.stopPropagation()
        if (!isLogged)
            return dispatch(addNotification({ type: 'info', text: 'Чтобы совершить это действие, нужно войти в аккаунт.', route: 'auth' }))
        dispatch(togglePopup({ type: 'reply', data: { commentId, userName: userName.split(' ')[0], userId: userData?._id } }))
    }

    const onEditButtonClick = (e) => {
        e.stopPropagation()
        if (type !== 'reply' && commentType === 'review')
            dispatch(togglePopup({ type: 'update-review', data: { commentId } }))

        if (type !== 'reply' && commentType === 'question')
            dispatch(togglePopup({ type: 'edit-question', data: { commentId } }))


        if (type === 'reply')
            dispatch(togglePopup({ type: 'edit-reply', data: { replyId: commentId } }))
    }

    const onLikeButtonClick = (method, e) => {
        // setIsLoading(true)   
        e.stopPropagation()
        if (!isLogged)
            return dispatch(addNotification({ type: 'info', text: 'Чтобы совершить это действие, нужно войти в аккаунт.', route: 'auth' }))

        type !== 'reply' && likeComment(commentId, { method, userId: userData?._id }).then(() => {
            refreshComment()
        }).catch(error => dispatch(addNotification({ type: 'error', text: error.message })))

        type === 'reply' && likeReply(commentId, { method, userId: userData?._id })
            .then(() => {
                refreshComment()
            })
            .catch(error => dispatch(addNotification({ type: 'error', text: error.message })))

    }

    const [historyVisible, setHistoryVisible] = useState(true)

    const isPreviewMode = window.location.pathname.includes(commentId)

    return !isLoading ? (
        <div
            className={styles['comment']}
            style={{ border: isPreviewMode && 0, maxHeight: isPreviewMode ? '100%' : '250px', order: comment?.userId === currentUser ? 0 : 1 }}
            onClick={onCommentClick}>
            <section className={styles['comment__header']}>
                <section className={styles['header__right-box']}>
                    <div>
                        {avatarUrl ? <img className='' src={avatarUrl} alt="" /> : <AvatarIcon />}
                        <section className={styles['right-box__name-section']}>
                            <h3>{commentUserId !== currentUser ? userName : 'Вы'}</h3>
                            {commentType === 'review' ? <p>Отзыв от покупателя</p> : null}
                        </section>
                    </div>
                    {commentType === 'review' && <ReviewStars ratingValue={ratingValue} />}
                </section>
                <p className={styles['comment__date']}>{new Date(Date.now()).getDay() === date.getDay() ? `${date.getHours()}:${date.getMinutes()}`
                    : date.toLocaleDateString()}</p>
            </section>
            <section className={styles['comment__text']}>
                <p className={!isPreviewMode ? styles['clamp'] : null}>{text}</p>
            </section>
            {isPreviewMode && editHistory.length && historyVisible ? <h3>История обновлений:</h3> : null}
            {
                isPreviewMode && editHistory.length && historyVisible ? <section className={styles['comment__edit-history']} style={{ height: isPreviewMode && historyVisible ? '100%' : '0', transition: '0.2s' }}>

                    {editHistory?.map(editItem => <HistoryItem key={editItem._id} data={editItem} />)}
                </section> : null
            }
            <section className={styles['comment__footer']}>

                <section className={styles['user-actions-buttons']}>
                    {currentUser !== commentUserId && type !== 'reply' ?
                        <GoReply style={{ transform: 'rotate(180deg)', width: '20px' }}
                            className={styles['footer__comment-button']}
                            onClick={onReplyButtonClick} /> : null}

                    {currentUser === commentUserId ? <CiEdit
                        className={styles['footer__comment-button']}
                        style={{ width: '20px' }}
                        onClick={onEditButtonClick} /> : null}
                    <section className={styles['actions-buttons__left-box']}>

                        {currentUser !== commentUserId ? <section className={styles['footer__likes-buttons']}>
                            <div className={styles['footer__comment-button']}
                                style={likes?.includes(currentUser) ? { color: 'var(--ui---main)' } : {}}>
                                <BiLike onClick={(e) => onLikeButtonClick('like', e)} />
                                <p>{likes?.length ? likes?.length : ''}</p>
                            </div>

                            <div className={styles['footer__comment-button']}
                                style={dislikes?.includes(currentUser) ? { color: 'var(--ui---main)' } : {}}>
                                <BiDislike onClick={(e) => onLikeButtonClick('dislike', e)} />
                                <p>{dislikes?.length ? dislikes?.length : ''}</p>
                            </div>
                        </section> : null}



                        {currentUser === commentUserId && commentType !== 'review' ? <RiDeleteBin6Line className={styles['footer__comment-remove-button']} /> : null}

                        {comment?.replies?.length && !window.location.pathname.includes(commentId) ? <p onClick={() => navigate(`/comments/${commentId}`)}>Ответы ({comment?.replies.length})</p> : null}
                        {/* {!isPreviewMode && commentType === 'review' && comment?.replies.length && editHistory.length ? '|' : ''} */}
                        {commentType === 'review' && editHistory.length && isPreviewMode ?
                            <p onClick={(e) => {
                                e.stopPropagation()
                                setHistoryVisible(!historyVisible)
                            }}>{historyVisible ? 'Скрыть историю' : 'Показать историю'}</p> : null}
                    </section>

                </section>
            </section>
        </div >
    ) : <SkeletonLadingShimmer style={{ width: '100%', height: 100 }} />
}
