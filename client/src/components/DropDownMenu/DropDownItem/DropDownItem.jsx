import React from 'react'

import styles from './DropDownItem.module.css'

export default function DropDownItem({ title, list }) {
    return (
        <div>
            <p>{title}</p>
            {list && Object.entries(list).map(([key, value]) => {
                return (<p key={key}>{value}</p>)
                // return (<p key={key}>{value}</p>)
            })}
        </div>
    )
}
