import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import {
    Box,
    CardMedia,
    CircularProgress,
    IconButton,
    LinearProgress,
    Paper,
    PropTypes,
    Tooltip,
} from '@material-ui/core'
import Moment from 'react-moment'
import i18next from 'i18next'
import FavoriteIcon from '@material-ui/icons/Favorite'
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd'
import DoneAllIcon from '@material-ui/icons/DoneAll'

import { GameLoaded, gameService, ScreenshotSize } from '../../../services/GameService'
import { placeholderImg } from '../../../services/Util/AssetsProvider'
import { t } from '../../../i18n'
import sStyles from './GameTopCard.module.scss'
import { flattenClasses } from '../../../services/Util/StyleUtils'
import { MainLayout } from '../../../layouts/MainLayout/MainLayout'
import { gameListService, GameListType, PredefinedListType } from '../../../services/GameListService'

const styles = ({ palette, spacing, breakpoints }: Theme) =>
    createStyles({
        mainSection: {
            position: 'relative',
            color: palette.common.white,
            marginBottom: spacing(0),
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            borderRadius: 0,
            boxShadow: 'none',
            maxHeight: 1000,
            [breakpoints.up('md')]: {
                maxHeight: 500,
            },
        },
        mainLayout: {
            paddingBottom: 0,
        },
        overlay: {
            position: 'absolute',
            filter: 'blur(8px)',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.8)',
        },
        mainSectionContent: {
            position: 'relative',
            filter: 'none',
            padding: spacing(1),
            [breakpoints.up('md')]: {
                padding: spacing(1),
                paddingRight: 0,
            },
        },
        cardMedia: {
            padding: spacing(1),
            width: '264px',
            height: '374px',
        },
        cover: {
            maxWidth: 264,
            margin: 'auto',
            [breakpoints.up('md')]: {
                margin: '24px 16px 0 0',
            },
        },
    })

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    game: GameLoaded
    classes: {
        mainSection: string
        mainSectionContent: string
        overlay: string
        cardMedia: string
        cover: string
        mainLayout: string
    }
}

interface State {
    inFavorites: boolean
    inWishList: boolean
    inPlayed: boolean
    loading: boolean
}

interface ListActionConfig {
    onClick: () => void
    color: PropTypes.Color
    tooltip: string
}

class GameTopCard extends Component<Props, State> {
    state = {
        inFavorites: false,
        inWishList: false,
        inPlayed: false,
        loading: true,
    }

    componentDidMount() {
        const { game } = this.props

        gameListService
            .getListsContaining(game.id)
            .then((lists) => {
                const inFavorites = !!lists.find((it) => it.type === GameListType.Favorites)
                const inWishList = !!lists.find((it) => it.type === GameListType.Wishlist)
                const inPlayed = !!lists.find((it) => it.type === GameListType.Played)

                this.setState({ inFavorites, inWishList, inPlayed })
            })
            .finally(() => this.setState({ loading: false }))
    }

    get backgroundImage() {
        const { game } = this.props
        const screenshots = gameService.getScreenshots(game, ScreenshotSize.P1080)

        return screenshots[0] ? screenshots[0].url : null
    }

    get gameListActions() {
        const { loading, inFavorites, inWishList, inPlayed } = this.state
        const favorites: ListActionConfig = {
            onClick: () =>
                inFavorites
                    ? this.removeFromList(PredefinedListType.Favorites)
                    : this.addToList(PredefinedListType.Favorites),
            color: inFavorites ? 'primary' : 'inherit',
            tooltip: inFavorites ? t`gameList.removeFromFavorites` : t`gameList.addToFavorites`,
        }
        const wishList: ListActionConfig = {
            onClick: () => {
                inWishList
                    ? this.removeFromList(PredefinedListType.Wishlist)
                    : this.addToList(PredefinedListType.Wishlist)
            },
            color: inWishList ? 'primary' : 'inherit',
            tooltip: inWishList ? t`gameList.removeFromWishList` : t`gameList.addToWishList`,
        }
        const played: ListActionConfig = {
            onClick: () =>
                inPlayed ? this.removeFromList(PredefinedListType.Played) : this.addToList(PredefinedListType.Played),
            color: inPlayed ? 'primary' : 'inherit',
            tooltip: inPlayed ? t`gameList.removeFromPlayed` : t`gameList.addToPlayed`,
        }

        return (
            <>
                {loading && <CircularProgress />}
                {!loading && (
                    <Grid container>
                        <Tooltip placement="top" title={favorites.tooltip}>
                            <IconButton color={favorites.color} onClick={favorites.onClick}>
                                <FavoriteIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip placement="top" title={wishList.tooltip}>
                            <IconButton color={wishList.color} onClick={wishList.onClick}>
                                <PlaylistAddIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip placement="top" title={played.tooltip}>
                            <IconButton color={played.color} onClick={played.onClick}>
                                <DoneAllIcon />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                )}
            </>
        )
    }

    addToList = (listType: PredefinedListType) => {
        const { game } = this.props

        this.setState({ loading: true })
        gameListService
            .addToPredefined(game.id, listType)
            .then(() => {
                switch (listType) {
                    case PredefinedListType.Wishlist:
                        this.setState({ inWishList: true })
                        break
                    case PredefinedListType.Played:
                        this.setState({ inPlayed: true })
                        break
                    case PredefinedListType.Favorites:
                        this.setState({ inFavorites: true })
                        break
                    default:
                        break
                }
            })
            .finally(() => this.setState({ loading: false }))
    }

    removeFromList = (listType: PredefinedListType) => {
        const { game } = this.props

        this.setState({ loading: true })
        gameListService
            .removeFromPredefined(game.id, listType)
            .then(() => {
                switch (listType) {
                    case PredefinedListType.Wishlist:
                        this.setState({ inWishList: false })
                        break
                    case PredefinedListType.Played:
                        this.setState({ inPlayed: false })
                        break
                    case PredefinedListType.Favorites:
                        this.setState({ inFavorites: false })
                        break
                    default:
                        break
                }
            })
            .finally(() => this.setState({ loading: false }))
    }

    renderRatingIndicator = (rating: number) => {
        const colorPrimary = flattenClasses([
            rating > 79 && sStyles.greenColorPrimary,
            rating < 41 && sStyles.redBarColorPrimary,
            rating > 39 && rating < 80 && sStyles.yellowColorPrimary,
        ])

        const barColorPrimary = flattenClasses([
            rating > 79 && sStyles.greenBarColorPrimary,
            rating < 41 && sStyles.redBarColorPrimary,
            rating > 39 && rating < 80 && sStyles.yellowBarColorPrimary,
        ])

        return <LinearProgress variant="determinate" value={rating} classes={{ colorPrimary, barColorPrimary }} />
    }

    render() {
        const { game, classes } = this.props
        const bg = this.backgroundImage

        return (
            <Paper className={classes.mainSection}>
                <div className={classes.overlay} style={bg ? { backgroundImage: `url(${bg})` } : {}} />
                <MainLayout hideFooter hideHeader className={classes.mainLayout}>
                    <Grid container className={classes.mainSectionContent}>
                        <Grid item md={2} className={classes.cover}>
                            <CardMedia className={classes.cardMedia} image={game.coverImage || placeholderImg} />
                        </Grid>
                        <Grid item md={8} className={classes.mainSectionContent}>
                            <div className={sStyles.contentOverlay}>
                                <Box m={2}>
                                    {game.rating && game.ratingCount && (
                                        <>
                                            <Typography color="inherit" className={sStyles.ratingText}>
                                                {t('game.ratingBasedOn', {
                                                    rating: game.rating?.toPrecision(2),
                                                    count: game.ratingCount,
                                                })}
                                            </Typography>
                                            {this.renderRatingIndicator(game.rating)}
                                        </>
                                    )}

                                    <Typography component="h1" variant="h4" color="inherit" gutterBottom>
                                        {game.name}
                                    </Typography>
                                    {game.releaseDate && (
                                        <Typography variant="h5" color="inherit" gutterBottom>
                                            <Moment locale={i18next.language} format="MMMM Do, YYYY">
                                                {game.releaseDate}
                                            </Moment>
                                        </Typography>
                                    )}
                                    <Typography variant="h6" color="inherit" paragraph>
                                        {game.companies.map((it) => it.name).join(', ')}
                                    </Typography>

                                    <Typography variant="subtitle1" color="inherit" paragraph>
                                        {game.summary}
                                    </Typography>
                                    {this.gameListActions}
                                </Box>
                            </div>
                        </Grid>
                    </Grid>
                </MainLayout>
            </Paper>
        )
    }
}

export default withRouter(withStyles(styles)(GameTopCard))
