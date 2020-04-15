import * as React from 'react'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import ProfileContent from '../../components/User/Profile/ProfileContent'
import { authService } from '../../services/AuthService'
import NotFound404 from '../Error/NotFound404'

export default function Profile() {
    const user = authService.getCurrentUser()

    if (!user) {
        return <NotFound404 />
    }

    return (
        <MainLayout>
            <ProfileContent user={user} />
        </MainLayout>
    )
}
