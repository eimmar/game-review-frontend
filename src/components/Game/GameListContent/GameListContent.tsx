import React from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { AppBar, Card, CardActions, CardContent, CardMedia, Container, CssBaseline, Toolbar } from '@material-ui/core'
import CameraIcon from '@material-ui/icons/PhotoCamera'

import { t } from '../../../i18n'
import { Game, gameService, ScreenshotSize } from '../../../services/GameService'
import { routes } from '../../../parameters'
import PageLoader from '../../Page/PageLoader'
import { placeholderImg } from '../../../services/Util/AssetsProvider'
import { AbstractPaginator, AbstractPaginatorState } from '../../Pagination/AbstractPaginator'

const styles = ({ palette, spacing }: Theme) =>
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
            paddingTop: spacing(8),
            paddingBottom: spacing(8),
        },
        card: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        },
        cardMedia: {
            paddingTop: '56.25%', // 16:9
        },
        cardContent: {
            flexGrow: 1,
        },
        footer: {
            backgroundColor: palette.background.paper,
            padding: spacing(6),
        },
    })

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    classes: {
        icon: string
        heroContent: string
        heroButtons: string
        cardGrid: string
        card: string
        cardMedia: string
        cardContent: string
        footer: string
    }
}

interface State extends AbstractPaginatorState {
    games: Game[]
}

class GameListContent extends AbstractPaginator<Props, State> {
    state: State = {
        games: [],
        pagination: {
            page: 1,
            totalResults: 0,
            pageSize: 5,
        },
        loading: false,
    }

    componentDidMount() {
        const { location } = this.props
        const { pagination } = this.state

        gameService.getAll(pagination, location.search).then((response) =>
            this.setState({
                games: response.items.map((game) => gameService.withCover(game, ScreenshotSize.CoverBig)),
                loading: false,
                pagination: {
                    totalResults: response.totalResults,
                    page: pagination.page,
                    pageSize: pagination.pageSize,
                },
            }),
        )
    }

    render() {
        const { classes } = this.props
        const { games, loading } = this.state

        return (
            <>
                <CssBaseline />
                <AppBar position="relative">
                    <Toolbar>
                        <CameraIcon className={classes.icon} />
                        <Typography variant="h6" color="inherit" noWrap>
                            {t`game.listHeader`}
                        </Typography>
                    </Toolbar>
                </AppBar>
                {/* Hero unit */}
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                            {t`game.listHeader`}
                        </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            {t`game.listMainDescription`}
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
                    {loading && <PageLoader />}
                    {!loading && (
                        <Grid container spacing={4}>
                            {games.map((game) => (
                                <Grid key={game.id} item xs={12} sm={6} md={4}>
                                    <Card className={classes.card}>
                                        <Link to={`${routes.game.view}/${game.id}`}>
                                            <CardMedia
                                                className={classes.cardMedia}
                                                image={game.coverImage || placeholderImg}
                                                title={game.name}
                                            />
                                        </Link>
                                        <CardContent className={classes.cardContent}>
                                            <Typography gutterBottom variant="h5" component="h2">
                                                <Link to={`${routes.game.view}/${game.id}`}>{game.name}</Link>
                                            </Typography>
                                            <Typography>{game.summary}</Typography>
                                        </CardContent>
                                        <CardActions>
                                            <Button size="small" color="primary">
                                                View
                                            </Button>
                                            <Button size="small" color="primary">
                                                Edit
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>
            </>
        )
    }
}

export default withRouter(withStyles(styles)(GameListContent))
