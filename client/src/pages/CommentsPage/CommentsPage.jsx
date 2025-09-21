import styles from './CommentsPage.module.css'

import Comment from '../../components/Comment/Comment'
import Button from '../../components/Button/Button'
import StarCount from './StarCount/StarCount'

import { useDispatch, useSelector } from 'react-redux'
import { togglePopup } from '../../redux/features/uiSlice'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { checkReviewEligibility, getProduct, getProductComments } from '../../api/api'
import { useCallback, useEffect, useRef, useState } from 'react'
import { IoChevronBackOutline } from "react-icons/io5"

import RadioButtonGroup from '../../components/RadioButtonGroup/RadioButtonGroup.jsx'
import { getAverageRating } from '../../utils/getAverageRating.js'
import EmptyPlaceholder from '../../components/EmptyPlaceholder/EmptyPlaceholder.jsx'

import Spinner from '../../components/Spinner/Spinner'
export default function CommentsPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { productId } = useParams()
    const { pathname } = useLocation()
    const [query, setQuery] = useSearchParams()


    const userData = useSelector(state => state.user.userData)
    const idCommentToUpdate = useSelector(state => state.shared.idCommentToUpdate)

    const [product, setProduct] = useState()
    const [commentType, setCommentType] = useState(query.get('type') || 'review')
    const [comments, setComments] = useState([])
    const [reviewEligibility, setReviewEligibilities] = useState({ isProductPurchased: false, isUserCommented: false })
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => { setCommentType(query.get('type')) }, [query])

    useEffect(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [pathname])

    useEffect(() => {
        getProduct(productId).then(res => setProduct(res.product)).catch(error => console.log(error))
    }, [productId])

    const memoizedReviewEligibility = useCallback(() => {
        userData?._id && productId && checkReviewEligibility(productId, userData._id).then(res => setReviewEligibilities({ ...res }))
            .catch(error => setError(error))
    }, [userData?._id, productId])

    useEffect(() => {
        memoizedReviewEligibility()
    }, [memoizedReviewEligibility])

    const onAddReviewButtonClick = () => {
        reviewEligibility.isUserCommented ?
            dispatch(togglePopup({ type: 'review', data: { type: 'update-review', commentId: reviewEligibility.isUserCommented._id } })) :
            dispatch(togglePopup({ type: 'review', data: { type: 'review', productId: productId } }))
    }

    const onAddQuestionButtonClick = () => {
        userData && dispatch(togglePopup({ type: 'question', data: { type: 'question', productId: productId } }))
    }

    const fetchComments = () => {
        setIsLoading(true)
        setError(null)
        getProductComments(productId, commentType).then(res => {
            setComments(res.comments)
            setIsLoading(true)
        })
            .catch(error => setError(error))
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {

        fetchComments()

        const newQuery = new URLSearchParams(query)
        newQuery.set('type', commentType)
        setQuery(newQuery)

    }, [userData, productId, commentType, query, setQuery, idCommentToUpdate])


    const backButtonRef = useRef(null)

    useEffect(() => {
        const handleEscDown = (e) => e.key === 'Escape' && backButtonRef.current.setAttribute('style', 'background-color:var(--ui---main);')
        const handleEscUp = (e) => e.key === 'Escape' && backButtonRef.current.click()

        document.addEventListener('keyup', handleEscUp)
        document.addEventListener('keydown', handleEscDown)

        return () => {
            document.removeEventListener('keyup', handleEscUp)
            document.removeEventListener('keydown', handleEscDown)
        }
    }, [])

    document.querySelector('title').innerHTML = 'Отзывы к товару'

    return (
        <div className={`${styles['comments-page']} container`}>
            <section className={styles['comments-page__layout']}>
                <button className={styles['layout__back-button']}
                    ref={backButtonRef}
                    onClick={() => navigate(`/products/${productId}`)}
                    type='button' >
                    <IoChevronBackOutline />
                    <div className={styles['back-button__product-miniature']}>
                        <img src="/images/categories/03.png" alt="product-image" />
                        <p>Вернутся к товару</p>
                    </div>
                </button>
                <section className={styles['comments-page__resume']}>
                    {!isLoading && !error ? <section className={styles['resume__header']}>
                        <RadioButtonGroup
                            className={styles['resume__mode']}
                            initialValue={query.get('type') === 'review' ? 0 : 1}
                            options={['Отзывы', 'Вопросы']}
                            onSelect={(selected) => setCommentType(selected === 0 ? 'review' : 'question')} />
                        <p>Оценка покупателей: <strong>{product?.ratingValue ? getAverageRating(product?.starsValues) : 0}/5 ★</strong></p>
                    </section> : <p style={{ fontSize: 14, color: 'var(--typography---second)' }}>Не удалось получить данные.</p>}
                    <StarCount data={product?.starsValues} />
                    {reviewEligibility.isProductPurchased && commentType === 'review' ? <Button title={reviewEligibility.isUserCommented ? 'Обновить отзыв' : 'Оставить отзыв'} className={styles['resume__add-comment-button']}
                        onClick={onAddReviewButtonClick} /> : null}
                    {commentType === 'review' && !reviewEligibility.isProductPurchased ? <p style={{ fontSize: 14, color: 'var(--typography---second)' }}>*Отзыв можно оставить только купив товар</p> : null}
                    {commentType === 'question' && <Button title='Задать вопрос' onClick={onAddQuestionButtonClick} />}
                </section>

                {!isLoading ? <section className={styles['comments-page__reviews']}>
                    {comments?.sort((a, b) => a.userId.localeCompare(b.userId)).map(comment => <Comment key={comment._id} commentData={comment} />)}

                    {!comments.length && !error && !isLoading && commentType === 'question' && <EmptyPlaceholder
                        title='Вопросов пока нет.'
                        action={onAddQuestionButtonClick} actionTitle='У меня появился вопрос.👀' />}

                    {!comments.length && !error && !isLoading && commentType === 'review' && <EmptyPlaceholder
                        title='Отзывов пока нет.'
                        action={reviewEligibility.isProductPurchased && onAddReviewButtonClick} actionTitle='Оставить отзыв.✨' />}

                    {error && <EmptyPlaceholder title='Не удалось загрузить отзывы.' actionTitle='Попробовать еще раз.' action={fetchComments} />}
                </section> : <Spinner />}
            </section>
        </div>
    )
}
