import * as React from 'react'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import RegistrationForm from '../../components/User/Registration/RegistrationForm'
import { t } from '../../i18n'

export default function Registration() {
    document.title = `${t`pageTitle.registration`} - ${t`common.websiteName`}`

    return (
        <MainLayout maxWidth="xs">
            <RegistrationForm />
        </MainLayout>
    )
}
