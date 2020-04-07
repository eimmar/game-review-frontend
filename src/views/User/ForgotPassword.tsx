import * as React from 'react'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import ForgotPasswordForm from '../../components/User/ForgotPassword/ForgotPasswordForm'

export default function ForgotPassword() {
    return (
        <MainLayout maxWidth="xs">
            <ForgotPasswordForm />
        </MainLayout>
    )
}
