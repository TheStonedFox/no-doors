
import styles from './ChooseCard.module.css'
import ArrowIcon from '@/svg/ArrowIcon'
export default function ChooseCard({ picture, title, onClick }) {
    return (
        <div title={title}
            className={styles.card}
            onMouseEnter={(e) => {
                e.currentTarget.querySelector('h3').style = 'color: var(--ui---main);'
                e.currentTarget.querySelector('svg').style = 'min-width: 24px'
            }}
            onMouseLeave={(e) => {
                e.currentTarget.querySelector('h3').style = ''
                e.currentTarget.querySelector('svg').style = 'min-width: 0px'
            }}
            onClick={onClick}
        >
            <img src={picture} alt="choose-card-image" />
            <div className={styles.title}>
                <h3>{title}</h3>
                <ArrowIcon />
            </div>
        </div>
    )
}
