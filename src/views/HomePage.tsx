import * as React from 'react'

import { MainLayout } from '../layouts/MainLayout/MainLayout'
import { t } from '../i18n'
import HomePageContent from '../components/HomePage/HomePageContent/HomePageContent'

function HomePage() {
    document.title = `${t`common.websiteName`}`

    return (
        <MainLayout>
            <HomePageContent />
        </MainLayout>
    )
}

export default HomePage
