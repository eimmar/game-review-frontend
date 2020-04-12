import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import GameViewContent from '../../components/Game/GameViewContent/GameViewContent'
import { GameLoaded, gameService, ScreenshotSize } from '../../services/GameService'
import PageLoader from '../../components/Global/PageLoader/PageLoader'
import { ContentLayout } from '../../layouts/ContentLayout/ContentLayout'
import GameTopCard from '../../components/Game/GameTopCard/GameTopCard'
import { Header } from '../../components/Header/Header'
import NotFound404 from '../Error/NotFound404'

export default function GameView() {
    const { guid } = useParams()
    const [loading, setLoading] = useState(true)
    const [game, setGame] = useState(null as GameLoaded | null)

    useEffect(() => {
        if (guid) {
            gameService
                .get(guid)
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

    if (!guid || !game) {
        return <NotFound404 />
    }

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
