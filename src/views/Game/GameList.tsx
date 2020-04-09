import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Component } from 'react'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import GameListContent from '../../components/Game/GameListContent/GameListContent'
import GamesFilter from '../../components/Game/GamesFilter/GamesFilter'
import {
    Company,
    GameEntityFilterValues,
    GameMode,
    gameService,
    Genre,
    Platform,
    Theme,
} from '../../services/GameService'

interface State extends GameEntityFilterValues {}

interface Props extends RouteComponentProps {}

class GameList extends Component<Props, State> {
    state = {
        genres: [] as Genre[],
        themes: [] as Theme[],
        platforms: [] as Platform[],
        gameModes: [] as GameMode[],
        companies: [] as Company[],
    }

    componentDidMount(): void {
        gameService.getAllFilterEntities().then((response) => this.setState(response))
    }

    render() {
        const { location } = this.props
        const { genres, themes, platforms, gameModes, companies } = this.state

        return (
            <MainLayout key={location.key}>
                <GamesFilter
                    genres={genres}
                    themes={themes}
                    companies={companies}
                    gameModes={gameModes}
                    platforms={platforms}
                />
                <GameListContent />
            </MainLayout>
        )
    }
}

export default withRouter(GameList)
