import { useEffect, useState } from 'react'
import styles from './ScrollUpButton.module.css'
import { FaChevronUp } from "react-icons/fa"
import { useSelector } from 'react-redux'

export default function ScrollUpButton() {
    const isProductActionPanelOpen = useSelector(state => state.ui.isProductActionPanelOpen)

    const [isPressed, setIsPressed] = useState(false)
    const [scrollTop, setScrollTop] = useState(0)

    const scrollHandler = () => setScrollTop(document.documentElement.scrollTop)

    useEffect(() => {
        window.addEventListener('scroll', scrollHandler)
        return () => window.removeEventListener('scroll', scrollHandler)
    }, [])


    return (
        <div className={styles['scroll-up-button']} style={{
            opacity: document.documentElement.scrollHeight / scrollTop < 5 ? '1' : '0',
            bottom: isProductActionPanelOpen ? 85 : 15,
            transition: '0.2s',
            transform: isPressed ? 'translateY(5px)' : 'translateY(0)',
        }}
            id='#up-button'
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => {
                setIsPressed(false)
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            onMouseLeave={() => setIsPressed(false)}>
            <FaChevronUp color='var( --ui---bg-main)' />
        </div>
    )
}
