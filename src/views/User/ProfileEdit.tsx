import * as React from 'react'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import { authService } from '../../services/AuthService'
import ProfileEditForm from '../../components/User/ProfileEditForm/ProfileEditForm'
import NotFound404 from '../Error/NotFound404'
import { t } from '../../i18n'

export default function ProfileEdit() {
    const user = authService.getCurrentUser()

    if (!user) {
        return <NotFound404 />
    }
    document.title = `${t`pageTitle.profileEdit`} - ${t`common.websiteName`}`

    return (
        <MainLayout maxWidth="xs">
            <ProfileEditForm initialValues={user} />
        </MainLayout>
    )
}
