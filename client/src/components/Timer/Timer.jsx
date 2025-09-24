import { useState, useEffect } from "react"
import styles from './Timer.module.css'
import Button from '../../components/Button/Button'

export default function Timer({ onTimeEnd, timerValue, onRestart }) {

    const [totalSeconds, setTotalSeconds] = useState(timerValue)

    const [time, setTime] = useState({ minutes: 0, seconds: 0 })


    useEffect(() => {
        const intervalHandler = () => {
            setTotalSeconds(prev => prev - 1 > 0 ? prev - 1 : 0)
        }
        const interval = setInterval(intervalHandler, 1000)
        if (totalSeconds === 0) {
            onTimeEnd && onTimeEnd()
            clearInterval(interval)
        }

        return () => clearInterval(interval)
    }, [totalSeconds, onTimeEnd])

    useEffect(() => {
        const sec = totalSeconds - 60 * parseInt(totalSeconds / 60)
        setTime({ minutes: parseInt(totalSeconds / 60), seconds: sec })
    }, [totalSeconds])
    return (
        <>
            <section className={styles['timer']}>{`0${time.minutes}:${time.seconds < 10 ? `0${time.seconds}` : time.seconds}`}</section>
            <Button title='Отправить еще раз.' disabled={totalSeconds} onClick={() => {
                setTotalSeconds(timerValue)
                onRestart && onRestart()
            }} />
        </>
    )
}
