import { useSelector } from 'react-redux'
import styles from './ProfileInfoContent.module.css'

export default function ProfileInfoContent() {
    const userData = useSelector((state => state.user.userData))

    return (
        <section className={styles['info']}>
            <h3 className={styles['info__title']}>Мои данные:</h3>
            <div className={styles['info__field']}>
                <div className={styles['info__field']}>
                    <h5>Телефон:</h5>
                    <p>{userData?.phone}</p>
                </div>
                <div className={styles['info__field']}>
                    <h5>Электронная почта:</h5>
                    <p>{userData?.email}</p>
                </div>
                <div className={styles['info__field']}>
                    <h5>Отделение почты:</h5>
                    <p>{`${userData?.city}, ${userData?.postOffice}`}</p>
                </div>
            </div>
        </section>
    )
}
