import * as React from 'react'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import RegistrationForm from '../../components/User/Registration/RegistrationForm'

export default class Registration extends React.PureComponent {
    render() {
        return (
            <MainLayout>
                <RegistrationForm />
            </MainLayout>
        )
    }
}
