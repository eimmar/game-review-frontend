import * as React from 'react'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import { authService } from '../../services/AuthService'
import NotFound404 from '../Error/NotFound404'
import ChangePasswordForm from '../../components/User/ChangePasswordForm/ChangePasswordForm'

export default function ChangePassword() {
    const user = authService.getCurrentUser()

    if (!user) {
        return <NotFound404 />
    }

    return (
        <MainLayout maxWidth="xs">
            <ChangePasswordForm userId={user.id} />
        </MainLayout>
    )
}
