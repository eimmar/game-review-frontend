import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import ResetPasswordForm from '../../components/User/ResetPassword/ResetPasswordForm'
import NotFound404 from '../../components/Error/ErrorContent'
import { authService } from '../../services/AuthService'
import ResetPasswordExpired from '../Error/ResetPasswordExpired'
import PageLoader from '../../components/Page/PageLoader'

export default function Login() {
    const { guid } = useParams()
    const [loading, setLoading] = useState(true)
    const [valid, setValid] = useState(false)

    useEffect(() => {
        if (guid) {
            authService
                .checkResetPassword(guid)
                .then((isValid) => setValid(isValid))
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

    if (!guid) {
        return <NotFound404 />
    }

    if (!valid) {
        return <ResetPasswordExpired />
    }

    return (
        <MainLayout maxWidth="xs">
            <ResetPasswordForm guid={guid} />
        </MainLayout>
    )
}
