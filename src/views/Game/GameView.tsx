import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import GameViewContent from '../../components/Game/GameViewContent/GameViewContent'
import NotFound404 from '../../components/Error/ErrorContent'
import { GameLoaded, gameService, ScreenshotSize } from '../../services/GameService'
import PageLoader from '../../components/Page/PageLoader'

export default function GameView() {
    const { guid } = useParams()
    const [loading, setLoading] = useState(true)
    const [game, setGame] = useState({} as GameLoaded)

    useEffect(() => {
        if (guid) {
            gameService
                .get(guid)
                .then((gameResponse) => gameService.withCover(gameResponse, ScreenshotSize.CoverBig))
                .then((gameResponse) => setGame(gameResponse))
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
        <MainLayout>
            <GameViewContent game={game} />
        </MainLayout>
    )
}
