import styles from './FilterItem.module.css'
import CrossIcon from '@/svg/CrossIcon'

export default function FilterItem({ title, onClick, style }) {
    return (
        <div className={styles['filter-item']} style={style} >
            {title ? <p className={styles['filter-item__title']}>{title}</p> : null}
            {title !== 'Очистить все' ? <button className={styles['filter-item__remove-button']} onClick={onClick}>
                <CrossIcon />
            </button> : null}

        </div >
    )
}
