import React from 'react'
import styles from './Burger.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { toggleBurger, toggleCatalog } from '../../features/ui/uiSlice'

export default function Burger({ title, className, color, onClick }) {

    const dispatch = useDispatch()
    useSelector((state) => state.burger.isBurgerOpen)

    const handleClick = (e) => {

        const lines = e.currentTarget.querySelector('div').querySelectorAll('span')
        lines[0].classList.toggle(styles.line_active)
        lines[1].classList.toggle(styles.hide)
        lines[2].classList.toggle(styles.line_active)
        onClick()
    }

    return (

        <div className={className} >
            <button className={styles.burger} type='button' onClick={handleClick}>
                <div className={styles.lines}>
                    <span className={styles.line} style={{ backgroundColor: color }}></span>
                    <span className={styles.line} style={{ backgroundColor: color }}></span>
                    <span className={styles.line} style={{ backgroundColor: color }}></span>
                </div>
                <h3 style={{ color: color }}>{title || 'Burger'}</h3>
            </button>
        </div >
    )
}
