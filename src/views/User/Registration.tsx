import * as React from 'react'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import RegistrationForm from '../../components/User/Registration/RegistrationForm'

export default function Registration() {
    return (
        <MainLayout maxWidth="xs">
            <RegistrationForm />
        </MainLayout>
    )
}
