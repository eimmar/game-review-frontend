import React from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import {
    CardMedia,
    Container,
    CssBaseline,
    ListItem,
    ListItemAvatar,
    ListItemText,
    List,
    Divider,
} from '@material-ui/core'
import { Pagination } from '@material-ui/lab'

import { t } from '../../../i18n'
import { Game, gameService, ScreenshotSize } from '../../../services/GameService'
import { routes } from '../../../parameters'
import PageLoader from '../../Global/PageLoader/PageLoader'
import { placeholderImg } from '../../../services/Util/AssetsProvider'
import { AbstractPaginator, AbstractPaginatorState } from '../../Pagination/AbstractPaginator'
import Centered from '../../Global/Centered/Centered'

const styles = ({ palette, spacing, breakpoints }: Theme) =>
    createStyles({
        icon: {
            marginRight: spacing(2),
        },
        heroContent: {
            backgroundColor: palette.background.paper,
            padding: spacing(8, 0, 6),
        },
        heroButtons: {
            marginTop: spacing(4),
        },
        cardGrid: {
            padding: 0,
            paddingTop: spacing(4),
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
    classes: {
        icon: string
        heroContent: string
        heroButtons: string
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
}

class GameListContent extends AbstractPaginator<Props, State> {
    constructor(props: Props) {
        super(props)
        const currentUrlParams = new URLSearchParams(props.location.search)

        this.state = {
            games: [],
            pagination: {
                page: Number(currentUrlParams.get('page') || 1),
                totalResults: 0,
                pageSize: 5,
            },
            loading: true,
        }
    }

    componentDidMount() {
        this.fetchData()
    }

    fetchData = () => {
        const { location } = this.props
        const { pagination } = this.state

        gameService.getAll(location.search, pagination.pageSize, pagination.totalResults).then((response) =>
            this.setState({
                games: response.items.map((game) => gameService.withCover(game, ScreenshotSize.CoverSmall)),
                loading: false,
                pagination: {
                    totalResults: response.totalResults,
                    page: pagination.page,
                    pageSize: pagination.pageSize,
                },
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

    render() {
        const { classes } = this.props
        const { games, loading } = this.state

        return (
            <>
                <CssBaseline />
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        <Typography component="h1" variant="h4" align="center" color="textPrimary" gutterBottom>
                            {t`game.listHeader`}
                        </Typography>
                        <div className={classes.heroButtons}>
                            <Grid container spacing={2} justify="center">
                                <Grid item>
                                    <Button variant="contained" color="primary">
                                        {t`game.mainCta`}
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="outlined" color="primary">
                                        {t`game.secondaryCta`}
                                    </Button>
                                </Grid>
                            </Grid>
                        </div>
                    </Container>
                </div>
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
                            {!loading &&
                                games.map((game) => (
                                    <div key={game.id}>
                                        <ListItem alignItems="flex-start" className={classes.listItem}>
                                            <ListItemAvatar className={classes.listAvatar}>
                                                <Link to={`${routes.game.view}/${game.id}`}>
                                                    <CardMedia
                                                        className={classes.cardMedia}
                                                        image={game.coverImage || placeholderImg}
                                                        title={game.name}
                                                    />
                                                </Link>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Link to={`${routes.game.view}/${game.id}`}>
                                                        <Typography gutterBottom variant="subtitle1" component="h2">
                                                            <b>{game.name}</b>
                                                        </Typography>
                                                    </Link>
                                                }
                                                secondary={
                                                    <Typography component="span" variant="body2" color="textPrimary">
                                                        {game.summary}
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                        <Divider component="li" />
                                    </div>
                                ))}
                        </List>
                    </Grid>
                </Container>

                <Grid container justify="center">
                    <Pagination
                        color="primary"
                        variant="outlined"
                        page={this.currentPage}
                        count={this.totalPages}
                        onChange={this.handlePageChange}
                        showFirstButton
                        showLastButton
                    />
                </Grid>
            </>
        )
    }
}

export default withRouter(withStyles(styles)(GameListContent))
