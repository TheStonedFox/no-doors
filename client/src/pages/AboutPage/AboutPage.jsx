import { Link } from 'react-router-dom'
import styles from './AboutPage.module.css'
import Location from '../../components/Location/Location'

export default function AboutPage() {
    return (
        <div className={`${styles['about-page']} container`}>
            <Location path='about' />
            <h2 className={`${'section-title'} ${styles['about-page__title']}`}>О компании No Doors Technology</h2>

            <section className={styles['about-page__layout']}>
                <div>
                    <p>Разнообразный и богатый опыт консультация с широким активом требуют определения и уточнения соответствующий условий активизации. Разнообразный и богатый опыт постоянное информационно-пропагандистское обеспечение нашей деятельности позволяет оценить значение системы обучения кадров, соответствует насущным потребностям. </p> -
                    <p> Равным образом рамки и место обучения кадров представляет собой интересный эксперимент проверки соответствующий условий активизации. Равным образом новая модель организационной деятельности требуют определения и уточнения систем массового участия.</p>
                </div>

                <img src="https://placehold.co/600x400" alt="about company image" />

            </section>

        </div >
    )
}
