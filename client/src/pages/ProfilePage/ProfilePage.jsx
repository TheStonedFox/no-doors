import React, { useEffect, useState } from 'react'

import styles from './ProfilePage.module.css'
import { getUser } from '../../api/api'



export default function ProfilePage() {
    const [user, setUser] = useState(null)
    useEffect(() => {
        const fetchUser = async () => setUser(await getUser())

        fetchUser()
    }, [])

    return (
        <div className={styles['profile-page']}>{user ? user.email : 'loading...'}</div >
    )
}
