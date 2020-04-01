import * as React from 'react'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import ForgotPasswordForm from '../../components/User/ForgotPassword/ForgotPasswordForm'

export default function Login() {
    return (
        <MainLayout maxWidth="xs">
            <ForgotPasswordForm />
        </MainLayout>
    )
}
