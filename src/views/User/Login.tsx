import * as React from 'react'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import LoginForm from '../../components/User/Login/LoginForm'

export default class Login extends React.PureComponent {
    render() {
        return (
            <MainLayout>
                <LoginForm />
            </MainLayout>
        )
    }
}
