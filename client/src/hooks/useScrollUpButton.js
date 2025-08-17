import { useEffect, useState } from 'react'

export default function useScrollUpButton({ offset }) {

    const scrollHandler = () => setScrollTop(document.documentElement.scrollTop)
    const [scrollTop, setScrollTop] = useState(0)

    useEffect(() => {
        window.addEventListener('scroll', scrollHandler)
        return () => window.removeEventListener('scroll', scrollHandler)
    }, [])


    document.getElementById('#up-button')?.setAttribute('style', `opacity: ${document.documentElement.scrollHeight / scrollTop < 5 ? '1;' : '0;'} bottom: ${offset}px; transition: 0.2s`)
    // const opacity = document.documentElement.scrollHeight / scrollTop < 5 ? '1' : '0'
}
