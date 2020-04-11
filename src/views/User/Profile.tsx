import * as React from 'react'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import ProfileContent from '../../components/User/Profile/ProfileContent'
import { authService, LoggedInUser } from '../../services/AuthService'

export default function Profile() {
    return (
        <MainLayout>
            <ProfileContent user={authService.getCurrentUser() as LoggedInUser} />
        </MainLayout>
    )
}
