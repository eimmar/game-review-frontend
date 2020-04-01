import * as React from 'react'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import GameListContent from '../../components/Game/GameListContent/GameListContent'

export default function GameList() {
    return (
        <MainLayout>
            <GameListContent />
        </MainLayout>
    )
}
