import { Link } from "react-router-dom"
import styles from './Location.module.css'
export default function Location({ path }) {

    const EngRoutesTitlesToRu = {
        'about': 'О компании',
        'order': 'Оформление заказа',
        'cart': 'Корзина',
        'favorites': 'Избранное',
        'search': 'Расширенный товаров',
        'guarantees': 'Гарантии',
        'delivery-and-pay': 'Доставка и оплата',
        'contacts': 'Контакты',
        'auth': 'Вход и регистрация',
        'profile': 'Личный кабинет',
        'comments': 'Отзывы и вопросы',
    }

    const pathRoutes = path?.split('/')
    return (
        <section className={styles['location']}>
            <Link className={styles['location__route-link']} to='/'>Главная /</Link>
            {pathRoutes?.map((piece, i) =>
                <Link className={styles['location__route-link']}
                    key={piece}
                    to={`/${piece}`}>
                    {` ${EngRoutesTitlesToRu[piece]} ${Boolean(i + 1 < pathRoutes.length) ? '/' : ''}`}
                </Link>)}
        </section>
    )
}
