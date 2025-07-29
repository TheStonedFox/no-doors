import React from 'react'
import styles from './DeliveryPayPage.module.css'
import Range from '../../components/Range/Range'

export default function DeliveryPayPage() {
    return (
        <div className={`${styles['delivery-pay-page']} container`}>
            <Range range={{ min: 0, max: 1000 }} />
        </div>
    )
}
