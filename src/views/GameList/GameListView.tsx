import * as React from 'react'
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import NotFound404 from '../Error/NotFound404'
import PageLoader from '../../components/Global/PageLoader/PageLoader'
import { GameList, gameListService, WithUser } from '../../services/GameListService'
import GameListViewContent from '../../components/GameList/GameListViewContent/GameListViewContent'

export default function GameListView() {
    const { guid } = useParams()
    const [loading, setLoading] = useState(true)
    const [gameList, setGameList] = useState(null as GameList<WithUser> | null)

    useEffect(() => {
        if (guid) {
            gameListService
                .get(guid)
                .then((response) => setGameList(response))
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

    if (!guid || !gameList) {
        return <NotFound404 />
    }

    return (
        <MainLayout>
            <GameListViewContent gameList={gameList} />
        </MainLayout>
    )
}
