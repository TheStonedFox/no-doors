import { useEffect, useRef, useState } from 'react'
import styles from './Slide.module.css'


export default function Slide({ onZoom, image }) {

    const ZOOM_BOX_SIZE = 130

    const slideWrapperRef = useRef(null)

    const [position, setPosition] = useState({ x: 0, y: 0 })
    const [imageSize, setImageSize] = useState({ height: 0, width: 0 })
    const [visible, setVisible] = useState(false)
    const [shiftsValues, setShiftsValues] = useState({ top: 0, left: 0 })
    const [fullScreenMode, setFullScreenMode] = useState(false)

    const handleMouseMove = (e) => {

        const rect = e.currentTarget.getBoundingClientRect()

        let x = e.clientX - rect.left - ZOOM_BOX_SIZE / 2
        let y = e.clientY - rect.top - ZOOM_BOX_SIZE / 2

        x = Math.max(0, Math.min(x, rect.width - ZOOM_BOX_SIZE))
        y = Math.max(0, Math.min(y, rect.height - ZOOM_BOX_SIZE))

        setShiftsValues({ top: y, left: x })
        setPosition({ x, y })
    }

    useEffect(() => { onZoom({ shiftsValues, visible, imageSize, fullScreenMode }) }, [visible, imageSize, shiftsValues])

    return (
        <div className={`${styles['slide-wrapper']}`}
            ref={slideWrapperRef}
            onMouseEnter={() => setVisible(true)}
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setVisible(false)}
        >
            <img src={image} alt="slider image" onLoad={(e) =>
                setImageSize({ height: e.currentTarget.clientHeight, width: e.currentTarget.clientWidth })} />

            {
                visible && !fullScreenMode ? <div className={styles['zoom-area']}
                    style={{ top: position.y, left: position.x, width: ZOOM_BOX_SIZE, height: ZOOM_BOX_SIZE, }}></div> : null
            }
        </div >
    )
}
