import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { CardMedia, Paper, LinearProgress } from '@material-ui/core'

import { GameLoaded, gameService, ScreenshotSize } from '../../../services/GameService'
import { placeholderImg } from '../../../services/Util/AssetsProvider'
import { t } from '../../../i18n'
import sStyles from './MainSection.module.scss'
import { flattenClasses } from '../../../services/Util/StyleUtils'

const styles = ({ palette, spacing, breakpoints }: Theme) =>
    createStyles({
        mainFeaturedPost: {
            position: 'relative',
            backgroundColor: palette.grey[800],
            color: palette.common.white,
            marginBottom: spacing(4),
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
        },
        overlay: {
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0,
            backgroundColor: 'rgba(0,0,0,.3)',
        },
        mainFeaturedPostContent: {
            position: 'relative',
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
    })

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    game: GameLoaded
    classes: {
        mainFeaturedPost: string
        mainFeaturedPostContent: string
        overlay: string
        cardMedia: string
    }
}

// eslint-disable-next-line react/prefer-stateless-function
class MainSection extends Component<Props> {
    get backgroundImage() {
        const { game } = this.props
        const screenshots = gameService.getScreenshots(game, ScreenshotSize.P1080)

        return screenshots[0] ? screenshots[0].url : null
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
            <Paper className={classes.mainFeaturedPost} style={bg ? { backgroundImage: `url(${bg})` } : {}}>
                <div className={classes.overlay} />
                <Grid container>
                    <Grid item md={3}>
                        <CardMedia className={classes.cardMedia} image={game.coverImage || placeholderImg} />
                    </Grid>
                    <Grid item md={9}>
                        {game.rating && game.ratingCount && (
                            <>
                                <Typography color="inherit">
                                    {t('game.ratingBasedOn', {
                                        rating: game.rating?.toPrecision(2),
                                        count: game.ratingCount,
                                    })}
                                </Typography>
                                {this.renderRatingIndicator(game.rating)}
                            </>
                        )}

                        <div className={classes.mainFeaturedPostContent}>
                            <Typography component="h1" variant="h4" color="inherit" gutterBottom>
                                {game.name}
                            </Typography>
                            {game.releaseDate && (
                                <Typography variant="h5" color="inherit" gutterBottom>
                                    {game.releaseDate}
                                </Typography>
                            )}
                            <Typography variant="h6" color="inherit" paragraph>
                                {game.companies.map((it) => it.name).join(', ')}
                            </Typography>

                            <Typography variant="subtitle1" color="inherit" paragraph>
                                {game.summary}
                            </Typography>
                        </div>
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}

export default withRouter(withStyles(styles)(MainSection))
