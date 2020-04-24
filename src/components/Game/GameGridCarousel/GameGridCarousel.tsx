import React from 'react'
import Typography from '@material-ui/core/Typography'
import { Box, CircularProgress, Button, Divider, Grid, CardMedia } from '@material-ui/core'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import i18next from 'i18next'

import { t } from '../../../i18n'
import { Pagination } from '../../../services/RequestService'
import { AbstractPaginator, AbstractPaginatorState } from '../../Pagination/AbstractPaginator'
import { Game, gameService, GamesFilterRequest, ScreenshotSize } from '../../../services/GameService'
import { routes } from '../../../parameters'
import { placeholderImg } from '../../../services/Util/AssetsProvider'
import styles from './GameGridCarousel.module.scss'
import RatingIndicator from '../RatingIndicator/RatingIndicator'
import { igdbService } from '../../../services/IGDBService'

interface Props {
    defaultActive?: boolean
    query?: GamesFilterRequest
}

interface State extends AbstractPaginatorState {
    games: Game[]
    wasActivated: boolean
    hasNextPage: boolean
}

class GameGridCarousel extends AbstractPaginator<Props, State> {
    state: State = {
        games: [],
        pagination: {
            page: 1,
            totalResults: 0,
            pageSize: 10,
        },
        loading: false,
        wasActivated: false,
        hasNextPage: false,
    }

    mounted = false

    componentDidMount(): void {
        this.mounted = true

        const { defaultActive } = this.props

        defaultActive && this.activate()
    }

    componentWillUnmount(): void {
        this.mounted = false
    }

    get carouselConfig() {
        return {
            superLargeDesktop: {
                breakpoint: { max: 4000, min: 3000 },
                items: 7,
            },
            desktop: {
                breakpoint: { max: 3000, min: 1024 },
                items: 5,
            },
            tablet: {
                breakpoint: { max: 1024, min: 464 },
                items: 3,
            },
            mobile: {
                breakpoint: { max: 464, min: 0 },
                items: 1,
            },
        }
    }

    get hasNextPage() {
        const { hasNextPage } = this.state

        return hasNextPage
    }

    activate = () => {
        const { wasActivated, pagination } = this.state

        !wasActivated && this.fetchData(pagination)
    }

    fetchData = (pagination: Pagination) => {
        const { query } = this.props
        const nextPageQuery = { ...query, page: String(pagination.page) }

        this.setState({ wasActivated: true, loading: true })
        igdbService
            .getAllFromFilters(nextPageQuery, pagination.pageSize + 1, this.getOffset(pagination))
            .then((response) =>
                this.setState((prevState) => {
                    const games = response
                        .slice(0, pagination.pageSize)
                        .map((game) => gameService.withCover(game, ScreenshotSize.ScreenshotMed))

                    return {
                        games: prevState.games.concat(games),
                        loading: false,
                        hasNextPage:
                            response.length > pagination.pageSize &&
                            pagination.page < igdbService.getMaxPage(pagination.pageSize),
                        pagination: {
                            totalResults: 0,
                            page: pagination.page,
                            pageSize: pagination.pageSize,
                        },
                    }
                }),
            )
            .finally(() => this.mounted && this.setState({ loading: false }))
    }

    renderGame(game: Game, index: number) {
        const { games } = this.state
        const loadMoreCallback =
            index + 1 === games.length && this.hasNextPage ? () => this.fetchData(this.nextPage) : false

        return (
            <Grid item key={index}>
                <div className={styles.card}>
                    <Link to={`${routes.game.view}/${game.slug}`}>
                        <CardMedia>
                            {game.rating && <RatingIndicator rating={game.rating} />}
                            <CardMedia
                                image={game.coverImage || placeholderImg}
                                title={game.name}
                                className={styles.image}
                            />
                        </CardMedia>
                        <div className={styles.cardContent}>
                            <Typography gutterBottom>{game.name}</Typography>
                            {game.releaseDate && (
                                <Typography variant="subtitle2" color="inherit" gutterBottom>
                                    <Moment locale={i18next.language} format="MMMM Do, YYYY">
                                        {game.releaseDate}
                                    </Moment>
                                </Typography>
                            )}
                        </div>
                    </Link>
                    {loadMoreCallback && (
                        <Button
                            className={styles.loadMore}
                            component="div"
                            variant="contained"
                            onClick={loadMoreCallback}
                            color="secondary"
                        >{t`common.more`}</Button>
                    )}
                </div>
            </Grid>
        )
    }

    render() {
        const { loading, games, wasActivated } = this.state

        return (
            <Box mb={2}>
                <Box mb={1}>
                    <Divider />
                </Box>
                {wasActivated && (
                    <Carousel responsive={this.carouselConfig} className="game-carousel">
                        {games.map((game, index) => this.renderGame(game, index))}
                    </Carousel>
                )}
                {loading && <CircularProgress />}
                {wasActivated && !loading && games?.length === 0 && t`common.noResults`}
                {!wasActivated && (
                    <Button variant="outlined" onClick={this.activate} color="primary">{t`common.more`}</Button>
                )}
            </Box>
        )
    }
}

export default GameGridCarousel
