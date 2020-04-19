import React from 'react'
import { Container, CssBaseline, Typography } from '@material-ui/core'

import { t } from '../../../i18n'
import GameGridCarousel from '../../Game/GameGridCarousel/GameGridCarousel'
import UserGridCarousel from '../../User/UserGridCarousel/UserGridCarousel'

function HomePageContent() {
    return (
        <>
            <CssBaseline />
            <Container>
                <Typography variant="h6">{t`homePage.latestGames`}</Typography>
                <GameGridCarousel defaultActive query={{ orderBy: 'releaseDate', order: 'DESC' }} />

                <Typography variant="h6" className="m-t-32">{t`homePage.topCriticRated`}</Typography>
                <GameGridCarousel defaultActive query={{ orderBy: 'rating', order: 'DESC' }} />

                <Typography variant="h6" className="m-t-64">{t`homePage.newestMembers`}</Typography>
                <UserGridCarousel defaultActive />
            </Container>
        </>
    )
}

export default HomePageContent
