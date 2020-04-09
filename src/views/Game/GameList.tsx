import * as React from 'react'
import { useLocation } from 'react-router-dom'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import GameListContent from '../../components/Game/GameListContent/GameListContent'

export default function GameList() {
    const location = useLocation()

    return (
        <MainLayout>
            <GameListContent key={location.key} />
        </MainLayout>
    )
}
