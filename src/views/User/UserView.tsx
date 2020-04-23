import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import ProfileContent from '../../components/User/Profile/ProfileContent'
import PageLoader from '../../components/Global/PageLoader'
import { User, userService } from '../../services/UserService'
import NotFound404 from '../Error/NotFound404'
import { t } from '../../i18n'

export default function UserView() {
    const { username } = useParams()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null as User | null)

    useEffect(() => {
        if (username) {
            userService
                .get(username)
                .then((response) => setUser(response))
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])

    if (loading) {
        return (
            <MainLayout maxWidth="xs">
                <PageLoader />
            </MainLayout>
        )
    }

    if (!username || !user) {
        return <NotFound404 />
    }
    document.title = `${userService.getFullName(user)} - ${t`common.websiteName`}`

    return (
        <MainLayout>
            <ProfileContent user={user} />
        </MainLayout>
    )
}
