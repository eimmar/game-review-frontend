import * as React from 'react'
import { Button } from '@material-ui/core'

import { MainLayout } from '../layouts/MainLayout/MainLayout'
import { authService } from '../services/AuthService'

function HomePage() {
    const user = authService.getCurrentUser()

    return (
        <MainLayout>
            {user && <Button onClick={() => authService.logout()}>Log out</Button>}
            <p>Home Page</p>
        </MainLayout>
    )
}

export default HomePage
