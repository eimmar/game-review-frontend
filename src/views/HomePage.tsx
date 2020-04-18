import * as React from 'react'

import { MainLayout } from '../layouts/MainLayout/MainLayout'
import { t } from '../i18n'

function HomePage() {
    document.title = `${t`common.websiteName`}`

    return (
        <MainLayout>
            <p>Home Page</p>
        </MainLayout>
    )
}

export default HomePage
