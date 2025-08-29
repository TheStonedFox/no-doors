import styles from './CommentsPage.module.css'

import Comment from '../../components/Comment/Comment'
import Button from '../../components/Button/Button'
import StarCount from './StarCount/StarCount'
import Spinner from '../../components/Spinner/Spinner'

import { useDispatch, useSelector } from 'react-redux'
import { togglePopup } from '../../redux/features/uiSlice'
import { data, useNavigate, useParams } from 'react-router-dom'
import { checkReviewEligibility, editComment, getProduct, getProductComments, getUserInfo } from '../../api/api'
import { useEffect, useRef, useState } from 'react'
import { setIdCommentToUpdate } from '../../redux/features/sharedSlice'
import { IoChevronBackOutline } from "react-icons/io5"

import RadioButtonGroup from '../../components/RadioButtonGroup/RadioButtonGroup.jsx'
import { getAverageRating } from '../../utils/getAvrrageRating.js'
import EmptyPlaceholder from '../../components/EmptyPlaceholder/EmptyPlaceholder.jsx'

export default function CommentsPage() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { productId } = useParams()

    const [comments, setComments] = useState([])

    const [reviewEligibility, setReviewEligibilities] = useState({ isProductPurchased: false, isUserCommented: false })

    const userData = useSelector(state => state.user.userData)

    const [product, setProduct] = useState()
    const idCommentToUpdate = useSelector(state => state.shared.idCommentToUpdate)

    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        getProduct(productId).then(res => setProduct(res.product)).catch(error => console.log(error))
    }, [productId])


    const onAddReviewButtonClick = () => {
        userData && productId && checkReviewEligibility(productId, userData._id).then(res => {
            res.isUserCommented ?
                dispatch(togglePopup({ type: 'review', data: { type: 'update-review', commentId: reviewEligibility.isUserCommented._id } })) :
                dispatch(togglePopup({ type: 'review', data: { type: 'review', productId: productId } }))
        })
            .catch(error => console.log(error))
    }

    const onAddQuestionButtonClick = () => {
        userData && dispatch(togglePopup({ type: 'question', data: { type: 'question', productId: productId } }))
    }
    const [commentType, setCommentType] = useState('review')


    useEffect(() => {

        userData && productId && checkReviewEligibility(productId, userData._id).then(res => setReviewEligibilities({ ...res }))
            .catch(error => console.log(error))

        getProductComments(productId, commentType).then(res => {
            setComments(res.comments)
            setIsLoading(true)
        })
            .catch(error => console.log(error))
            .finally(() => setIsLoading(false))
    }, [userData, productId, commentType, idCommentToUpdate])

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
        <div className={`${styles['comments-page']} container`} onKeyUp={(e) => e.key === 'Escape' && alert('asd')}>
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
                {!isLoading ? <section className={styles['comments-page__resume']}>
                    <section className={styles['resume__header']}>
                        <RadioButtonGroup
                            className={styles['resume__mode']}
                            options={['Отзывы', 'Вопросы']}
                            onSelect={(selected) => setCommentType(selected === 0 ? 'review' : 'question')} />
                        <p>Оценка покупателей: <strong>{product?.ratingValue ? getAverageRating(product?.starsValues) : 0}/5 ★</strong></p>
                    </section>
                    <StarCount data={product?.starsValues} />
                    {reviewEligibility.isProductPurchased && commentType === 'review' ? <Button title={reviewEligibility.isUserCommented ? 'Обновить отзыв' : 'Оставить отзыв'} className={styles['resume__add-comment-button']}
                        onClick={onAddReviewButtonClick} /> : null}
                    {commentType === 'review' && !reviewEligibility.isProductPurchased ? <p style={{ fontSize: 14, color: 'var(--typography---second)' }}>*Отзыв можно оставить только купив товар</p> : null}
                    {commentType === 'question' && <Button title='Задать вопрос' onClick={onAddQuestionButtonClick} />}
                </section> : <Spinner />}
                {!isLoading ? <section className={styles['comments-page__reviews']}>
                    {comments?.map(comment => <Comment key={comment._id} commentData={comment} />)}
                    {!comments.length && !isLoading ? <EmptyPlaceholder title={`${commentType === 'review' ? 'Отзывов' : 'Вопросов'} пока нет.`} /> : null}
                </section> : <Spinner />}
            </section>
        </div>
    )
}
