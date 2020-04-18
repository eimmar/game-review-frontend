import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import ResetPasswordForm from '../../components/User/ResetPassword/ResetPasswordForm'
import NotFound404 from '../../components/Error/ErrorContent'
import { authService } from '../../services/AuthService'
import ResetPasswordExpired from '../Error/ResetPasswordExpired'
import PageLoader from '../../components/Global/PageLoader'
import { t } from '../../i18n'

export default function ResetPassword() {
    const { token } = useParams()
    const [loading, setLoading] = useState(true)
    const [valid, setValid] = useState(false)

    useEffect(() => {
        if (token) {
            authService
                .checkResetPassword(token)
                .then(() => setValid(true))
                .catch(() => setValid(false))
                .finally(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])

    if (loading) {
        return (
            <MainLayout maxWidth="xs">
                <PageLoader />
            </MainLayout>
        )
    }

    if (!token) {
        return <NotFound404 />
    }

    if (!valid) {
        return (
            <MainLayout>
                <ResetPasswordExpired />
            </MainLayout>
        )
    }
    document.title = `${t`pageTitle.resetPassword`} - ${t`common.websiteName`}`

    return (
        <MainLayout maxWidth="xs">
            <ResetPasswordForm token={token} />
        </MainLayout>
    )
}
