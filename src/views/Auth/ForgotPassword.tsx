import * as React from 'react'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import ForgotPasswordForm from '../../components/User/ForgotPassword/ForgotPasswordForm'
import { t } from '../../i18n'

export default function ForgotPassword() {
    document.title = `${t`pageTitle.forgotPassword`} - ${t`common.websiteName`}`

    return (
        <MainLayout maxWidth="xs">
            <ForgotPasswordForm />
        </MainLayout>
    )
}
