import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import GameViewContent from '../../components/Game/GameViewContent/GameViewContent'
import { GameLoaded, gameService, ScreenshotSize } from '../../services/GameService'
import PageLoader from '../../components/Global/PageLoader'
import { ContentLayout } from '../../layouts/ContentLayout/ContentLayout'
import GameTopCard from '../../components/Game/GameTopCard/GameTopCard'
import NotFound404 from '../Error/NotFound404'
import Header from '../../components/Header/Header'
import { t } from '../../i18n'
import { igdbService } from '../../services/IGDBService'

export default function GameView() {
    const { slug } = useParams()
    const [loading, setLoading] = useState(true)
    const [game, setGame] = useState(null as GameLoaded | null)

    useEffect(() => {
        if (slug) {
            igdbService
                .game(slug)
                .then((response) => setGame(gameService.withCover(response, ScreenshotSize.CoverBig)))
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

    if (!slug || !game) {
        return <NotFound404 />
    }
    document.title = `${game.name} - ${t`common.websiteName`}`

    return (
        <>
            <ContentLayout>
                <Header />
                <GameTopCard game={game} />
            </ContentLayout>
            <MainLayout hideHeader>
                <GameViewContent game={game} />
            </MainLayout>
        </>
    )
}
