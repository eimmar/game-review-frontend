import React from 'react'
import { Container, CssBaseline, Typography } from '@material-ui/core'
import moment from 'moment'

import { t } from '../../../i18n'
import GameGridCarousel from '../../Game/GameGridCarousel/GameGridCarousel'
import UserGridCarousel from '../../User/UserGridCarousel/UserGridCarousel'

function HomePageContent() {
    return (
        <>
            <CssBaseline />
            <Container>
                <Typography variant="h6">{t`homePage.latestGames`}</Typography>
                <GameGridCarousel
                    defaultActive
                    query={{ orderBy: 'releaseDate', order: 'DESC', releaseDateTo: moment().format('YYYY-MM-DD') }}
                />

                <Typography variant="h6">{t`homePage.comingSoon`}</Typography>
                <GameGridCarousel
                    defaultActive
                    query={{ orderBy: 'releaseDate', order: 'ASC', releaseDateFrom: moment().format('YYYY-MM-DD') }}
                />

                <Typography variant="h6" className="m-t-32">{t`homePage.topCriticRated`}</Typography>
                <GameGridCarousel defaultActive query={{ orderBy: 'rating', order: 'DESC', ratingCountFrom: '0' }} />

                <Typography variant="h6" className="m-t-64">{t`homePage.newestMembers`}</Typography>
                <UserGridCarousel defaultActive query={{ orderBy: 'createdAt', order: 'DESC' }} />
            </Container>
        </>
    )
}

export default HomePageContent
