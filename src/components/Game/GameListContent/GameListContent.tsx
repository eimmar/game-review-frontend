import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter, Link } from 'react-router-dom'
import { CssBaseline, CardMedia, CardContent, Card, Container, CardActions, AppBar, Toolbar } from '@material-ui/core'
import CameraIcon from '@material-ui/icons/PhotoCamera'

import { t } from '../../../i18n'
import { Game, gameService } from '../../../services/GameService'
import { routes } from '../../../parameters'
import PageLoader from '../../Page/PageLoader'
import { placeholderImg } from '../../../services/Util/AssetsProvider'

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

interface State {
    games: Game[]
    loading: boolean
}

class GameListContent extends Component<Props, State> {
    state = { games: [] as Game[], loading: true }

    componentDidMount() {
        gameService.getAll().then((games) => this.setState({ games: gameService.withBigCover(games), loading: false }))
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
