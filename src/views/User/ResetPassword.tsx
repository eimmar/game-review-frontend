import * as React from 'react'
import { useParams } from 'react-router-dom'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import ResetPasswordForm from '../../components/User/ResetPassword/ResetPasswordForm'
import NotFound404 from '../../components/Error/NotFound404Content'
import { authService } from '../../services/AuthService'
import ResetPasswordExpired from '../Error/ResetPasswordExpired'

export default function Login() {
    const { guid } = useParams()

    if (!guid) {
        return <NotFound404 />
    }

    if (!authService.checkResetPassword(guid)) {
        return <ResetPasswordExpired />
    }

    return (
        <MainLayout maxWidth="xs">
            <ResetPasswordForm guid={guid} />
        </MainLayout>
    )
}
