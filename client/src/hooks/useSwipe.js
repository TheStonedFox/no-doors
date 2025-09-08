import { useRef, useState } from "react"

export default function useSwipe(isOpen, panelRef, action) {
    const [translateX, setTranslateX] = useState(0)
    const startX = useRef(0)
    const startY = useRef(0)
    const currentX = useRef(0)
    const isDragging = useRef(false)
    const isHorizontalSwipe = useRef(false)
    // const [disableSwipe, setDisableSwipe] = useState(false)

    const handleTouchStart = (e) => {
        const touch = e.touches[0]
        startX.current = touch.clientX
        startY.current = touch.clientY
        currentX.current = startX.current
        isDragging.current = true
        isHorizontalSwipe.current = false
    }

    const handleTouchMove = (e) => {
        // if (disableSwipe) return
        if (!isDragging.current) return

        const touch = e.touches[0]
        const dx = touch.clientX - startX.current
        const dy = touch.clientY - startY.current

        if (!isHorizontalSwipe.current) {
            if (Math.abs(dx) > Math.abs(dy)) {
                isHorizontalSwipe.current = true
            } else {
                isDragging.current = false
                return
            }
        }

        currentX.current = touch.clientX

        let offset = dx
        if (isOpen) offset = Math.min(0, dx)

        setTranslateX(offset)
    }

    const handleTouchEnd = () => {
        if (!isDragging.current || !isHorizontalSwipe.current) return
        isDragging.current = false

        const dx = currentX.current - startX.current
        const menuWidth = panelRef.current?.offsetWidth || 0  // ✅ защита от null

        if (isOpen) {
            if (Math.abs(dx) > menuWidth / 2.8) {
                action()
                setTranslateX(-menuWidth)
            } else {
                setTranslateX(0)
            }
        }
    }

    return { handleTouchStart, handleTouchEnd, handleTouchMove, translateX }
}
