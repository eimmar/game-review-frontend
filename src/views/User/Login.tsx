import * as React from 'react'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import LoginForm from '../../components/User/Login/LoginForm'

export default function Login() {
    return (
        <MainLayout maxWidth="xs">
            <LoginForm />
        </MainLayout>
    )
}
