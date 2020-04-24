import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import {
    CardMedia,
    Container,
    ListItem,
    ListItemAvatar,
    ListItemText,
    List,
    Divider,
    Button,
    ListItemSecondaryAction,
    IconButton,
    Tooltip,
} from '@material-ui/core'
import { Pagination as PaginationComponent } from '@material-ui/lab'
import DeleteIcon from '@material-ui/icons/Delete'
import { toast } from 'react-toastify'
import Moment from 'react-moment'
import i18next from 'i18next'

import { t } from '../../../i18n'
import { Game, gameService, ScreenshotSize } from '../../../services/GameService'
import { routes } from '../../../parameters'
import PageLoader from '../../Global/PageLoader'
import { placeholderImg } from '../../../services/Util/AssetsProvider'
import { AbstractPaginator, AbstractPaginatorState } from '../../Pagination/AbstractPaginator'
import Centered from '../../Global/Centered/Centered'
import { Pagination } from '../../../services/RequestService'
import RatingIndicator from '../RatingIndicator/RatingIndicator'
import { igdbService } from '../../../services/IGDBService'

const styles = ({ palette, spacing, breakpoints }: Theme) =>
    createStyles({
        icon: {
            marginRight: spacing(2),
        },
        cardGrid: {
            padding: 0,
        },
        cardMedia: {
            width: 90,
            height: 128,
            margin: 'auto',
        },
        footer: {
            backgroundColor: palette.background.paper,
            padding: spacing(6),
        },
        list: {
            width: '100%',
            backgroundColor: palette.background.paper,
            padding: 0,
            minHeight: 200,
            marginBottom: spacing(2),
        },
        inline: {
            display: 'inline',
        },
        listItem: {
            padding: spacing(2),
            [breakpoints.only('xs')]: {
                display: 'block',
            },
        },
        listAvatar: {
            marginRight: 16,
            [breakpoints.only('xs')]: {
                marginRight: 0,
                marginBottom: 16,
            },
        },
    })

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    dataFunction: (search: string, limit: number, offset: number) => Promise<Game[]>
    deleteFunction?: (game: Game) => Promise<any>
    infiniteScroll?: boolean
    classes: {
        icon: string
        cardGrid: string
        cardMedia: string
        footer: string
        list: string
        inline: string
        listItem: string
        listAvatar: string
    }
}

interface State extends AbstractPaginatorState {
    games: Game[]
    hasNextPage: boolean
}

class GameListContent extends AbstractPaginator<Props, State> {
    constructor(props: Props) {
        super(props)
        const currentUrlParams = new URLSearchParams(props.location.search)

        this.state = {
            games: [],
            hasNextPage: false,
            pagination: {
                page: Number(currentUrlParams.get('page') || 1),
                totalResults: 0,
                pageSize: 20,
            },
            loading: true,
        }
    }

    get hasNextPage() {
        const { hasNextPage } = this.state

        return hasNextPage
    }

    get totalPages() {
        const { pagination } = this.state

        return Math.min(igdbService.getMaxPage(pagination.pageSize), pagination.page + Number(this.hasNextPage))
    }

    componentDidMount() {
        const { pagination } = this.state

        this.fetchData(pagination)
    }

    fetchData = (pagination: Pagination) => {
        const { location, dataFunction, infiniteScroll } = this.props

        dataFunction(location.search, pagination.pageSize + 1, this.getOffset(pagination)).then((response) =>
            this.setState((prevState) => {
                const games = response
                    .slice(0, pagination.pageSize)
                    .map((game) => gameService.withCover(game, ScreenshotSize.CoverSmall))

                return {
                    games: infiniteScroll ? prevState.games.concat(games) : games,
                    loading: false,
                    hasNextPage: response.length > pagination.pageSize,
                    pagination: {
                        totalResults: 0,
                        page: pagination.page,
                        pageSize: pagination.pageSize,
                    },
                }
            }),
        )
    }

    changePage = () => {
        const { pagination } = this.state
        const { location, history } = this.props
        const currentUrlParams = new URLSearchParams(location.search)

        currentUrlParams.set('page', String(pagination.page))
        history.push(`${location.pathname}?${currentUrlParams.toString()}`)
    }

    handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        const { pagination } = this.state

        this.setState({ pagination: { ...pagination, page } }, this.changePage)
    }

    removeGameFromState = (game: Game) => {
        const { games } = this.state

        this.setState({ games: games.filter((it) => it.id !== game.id) }, () => {
            toast.info(t`game.successRemove`)
        })
    }

    render() {
        const { classes, infiniteScroll, deleteFunction } = this.props
        const { games, loading } = this.state

        return (
            <>
                <Container className={classes.cardGrid}>
                    <Grid container spacing={0}>
                        <List className={classes.list}>
                            {loading && <PageLoader />}
                            {!loading && games.length === 0 && (
                                <Centered>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {t`common.noResults`}
                                    </Typography>
                                </Centered>
                            )}
                            {(!loading || infiniteScroll) &&
                                games.map((game) => (
                                    <div key={game.externalId}>
                                        <ListItem alignItems="flex-start" className={classes.listItem}>
                                            {game.rating && <RatingIndicator rating={game.rating} />}
                                            <ListItemAvatar className={classes.listAvatar}>
                                                <Link to={`${routes.game.view}/${game.slug}`}>
                                                    <CardMedia
                                                        className={classes.cardMedia}
                                                        image={game.coverImage || placeholderImg}
                                                        title={game.name}
                                                    />
                                                </Link>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Link to={`${routes.game.view}/${game.slug}`}>
                                                        <Typography gutterBottom variant="subtitle1" component="h2">
                                                            <b>{game.name}</b>
                                                        </Typography>
                                                        {game.releaseDate && (
                                                            <Typography
                                                                variant="subtitle2"
                                                                color="inherit"
                                                                gutterBottom
                                                            >
                                                                <Moment
                                                                    locale={i18next.language}
                                                                    format="MMMM Do, YYYY"
                                                                >
                                                                    {game.releaseDate}
                                                                </Moment>
                                                            </Typography>
                                                        )}
                                                    </Link>
                                                }
                                                secondary={
                                                    <Typography component="span" variant="body2" color="textPrimary">
                                                        {game.summary ? `${game.summary.substring(0, 240)}...` : ''}
                                                    </Typography>
                                                }
                                            />
                                            {deleteFunction && (
                                                <ListItemSecondaryAction>
                                                    <Tooltip placement="top" title={t`common.delete`}>
                                                        <IconButton
                                                            edge="end"
                                                            onClick={() =>
                                                                deleteFunction(game)
                                                                    .then(() => this.removeGameFromState(game))
                                                                    .catch(() => toast.error(t`game.cantDelete`))
                                                            }
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                </ListItemSecondaryAction>
                                            )}
                                        </ListItem>
                                        <Divider component="li" />
                                    </div>
                                ))}
                        </List>
                    </Grid>
                </Container>

                <Grid container justify="center">
                    {infiniteScroll && this.hasNextPage && !loading && (
                        <Button
                            variant="contained"
                            onClick={() => this.fetchData(this.nextPage)}
                            color="primary"
                        >{t`common.more`}</Button>
                    )}

                    {!infiniteScroll && (
                        <PaginationComponent
                            color="primary"
                            variant="outlined"
                            page={this.currentPage}
                            count={this.totalPages}
                            onChange={this.handlePageChange}
                            showFirstButton
                        />
                    )}
                </Grid>
            </>
        )
    }
}

export default withRouter(withStyles(styles)(GameListContent))
