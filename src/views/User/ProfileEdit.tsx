import * as React from 'react'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import { authService } from '../../services/AuthService'
import ProfileEditForm from '../../components/User/ProfileEditForm/ProfileEditForm'
import NotFound404 from '../Error/NotFound404'

export default function ProfileEdit() {
    const user = authService.getCurrentUser()

    if (!user) {
        return <NotFound404 />
    }

    return (
        <MainLayout maxWidth="xs">
            <ProfileEditForm initialValues={user} />
        </MainLayout>
    )
}
