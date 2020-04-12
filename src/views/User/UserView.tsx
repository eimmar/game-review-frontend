import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import ProfileContent from '../../components/User/Profile/ProfileContent'
import PageLoader from '../../components/Global/PageLoader/PageLoader'
import { User, userService } from '../../services/UserService'
import NotFound404 from '../Error/NotFound404'

export default function UserView() {
    const { guid } = useParams()
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null as User | null)

    useEffect(() => {
        if (guid) {
            userService
                .get(guid)
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

    if (!guid || !user) {
        return <NotFound404 />
    }

    return (
        <MainLayout>
            <ProfileContent user={user} />
        </MainLayout>
    )
}
