import { useDispatch, useSelector } from 'react-redux'

import style from './Popup.module.css'

import { togglePopup } from '../../redux/features/uiSlice'
import OrderDetailsPopup from './PopupCases/OrderDetailsPopup/OrderDetailsPopup'
import CrossIcon from '@/svg/CrossIcon'
import ReplyPopup from './PopupCases/ReplyPopup/ReplyPopup'
import CommentPopup from './PopupCases/CommentPopup/CommentPopup'
import RemoveCommentPopup from './PopupCases/RemoveCommentPopup/RemoveCommentPopup'

export default function Popup() {
    const isPopupOpen = useSelector((state) => state.ui.isPopupOpen)
    const popup = useSelector(state => state.ui.popup)
    const dispatch = useDispatch()

    return (
        <div
            className={style['popup']}
            id='popup'
            style={isPopupOpen ? {
                // opacity: '1',
                height: '100%',
                // WebkitBackdropFilter: 'blur(55px);',
                // backdropFilter: 'blur(15px)',
            } : {
                // opacity: '0',
                height: '0px',
                // WebkitBackdropFilter: 'blur(0px);',
                // backdropFilter: 'blur(0px)',
            }}
            onClick={(e) => {
                e.target === e.currentTarget && dispatch(togglePopup())
            }}
        >
            <div className={style['popup__content']} style={{ maxWidth: popup?.type === 'order-card' ? '800px' : '400px' }}>
                <button className={style['popup__close-button']} onClick={() => dispatch(togglePopup())}>
                    <CrossIcon />
                </button>
                {popup?.type === 'order-card' && <OrderDetailsPopup orderId={popup?.data} />}
                {popup?.type === 'review' && <CommentPopup {...popup?.data} />}
                {popup?.type === 'update-review' && <CommentPopup {...popup?.data} type={popup?.type} />}
                {popup?.type === 'question' && <CommentPopup {...popup?.data} type={popup?.type} />}
                {popup?.type === 'edit-question' && <CommentPopup {...popup?.data} type={popup?.type} />}
                {popup?.type === 'reply' && <ReplyPopup {...popup?.data} type={popup?.type} />}
                {popup?.type === 'edit-reply' && <ReplyPopup {...popup?.data} type={popup?.type} />}
                {popup?.type === 'remove-comment' && <RemoveCommentPopup {...popup?.data} />}
            </div>
        </div>
    )
}
