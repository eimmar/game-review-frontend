import * as React from 'react'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import LoginForm from '../../components/User/Login/LoginForm'
import { t } from '../../i18n'

export default function Login() {
    document.title = `${t`pageTitle.login`} - ${t`common.websiteName`}`

    return (
        <MainLayout maxWidth="xs">
            <LoginForm />
        </MainLayout>
    )
}
