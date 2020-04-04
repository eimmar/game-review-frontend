import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { CardMedia, Paper, LinearProgress } from '@material-ui/core'

import { GameLoaded, gameService, ScreenshotSize } from '../../../services/GameService'
import { placeholderImg } from '../../../services/Util/AssetsProvider'
import { t } from '../../../i18n'
import sStyles from '../GameViewContent/MainSection.module.scss'
import { flattenClasses } from '../../../services/Util/StyleUtils'
import { MainLayout } from '../../../layouts/MainLayout/MainLayout'

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
            backgroundColor: 'rgba(0,0,0,.3)',
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
                margin: 0,
                marginRight: 16,
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

class GameTopCard extends Component<Props> {
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
            <Paper className={classes.mainSection}>
                <div className={classes.overlay} style={bg ? { backgroundImage: `url(${bg})` } : {}} />
                <MainLayout hideFooter hideHeader className={classes.mainLayout}>
                    <Grid container className={classes.mainSectionContent}>
                        <Grid item md={2} className={classes.cover}>
                            <CardMedia className={classes.cardMedia} image={game.coverImage || placeholderImg} />
                        </Grid>
                        <Grid item md={8} className={classes.mainSectionContent}>
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

                            <div>
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
                </MainLayout>
            </Paper>
        )
    }
}

export default withRouter(withStyles(styles)(GameTopCard))
