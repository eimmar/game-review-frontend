import * as React from 'react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import NotFound404 from '../Error/NotFound404'
import PageLoader from '../../components/Global/PageLoader'
import { GameList, gameListService, GameListType, WithUser } from '../../services/GameListService'
import GameListViewContent from '../../components/GameList/GameListViewContent/GameListViewContent'
import { t } from '../../i18n'

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
    document.title = `${gameListTitle(gameList)} - ${t`common.websiteName`}`

    return (
        <MainLayout>
            <GameListViewContent gameList={gameList} />
        </MainLayout>
    )
}

function gameListTitle(gameList: GameList) {
    if (gameList.type === GameListType.Favorites) {
        return t`user.favorites`
    }

    if (gameList.type === GameListType.Wishlist) {
        return t`user.wishList`
    }

    if (gameList.type === GameListType.Playing) {
        return t`user.playing`
    }

    return `${t`pageTitle.gameListView`} ${gameList.name}`
}
