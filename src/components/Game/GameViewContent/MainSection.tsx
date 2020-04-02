import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Link, Paper } from '@material-ui/core'

import { GameLoaded } from '../../../services/GameService'
import { placeholderImg } from '../../../services/Util/AssetsProvider'

const styles = ({ palette, spacing, breakpoints }: Theme) =>
    createStyles({
        mainFeaturedPost: {
            position: 'relative',
            backgroundColor: palette.grey[800],
            color: palette.common.white,
            marginBottom: spacing(4),
            backgroundImage: 'url(https://source.unsplash.com/random)',
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
            padding: spacing(3),
            [breakpoints.up('md')]: {
                padding: spacing(6),
                paddingRight: 0,
            },
        },
    })

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    game: GameLoaded
    classes: {
        mainFeaturedPost: string
        mainFeaturedPostContent: string
        overlay: string
    }
}

// eslint-disable-next-line react/prefer-stateless-function
class MainSection extends Component<Props> {
    render() {
        const { game, classes } = this.props

        return (
            <Paper className={classes.mainFeaturedPost} style={{ backgroundImage: `url(${game.coverImage})` }}>
                <img style={{ display: 'none' }} src={game.coverImage || placeholderImg} alt={game.name} />
                <div className={classes.overlay} />
                <Grid container>
                    <Grid item md={6}>
                        <div className={classes.mainFeaturedPostContent}>
                            <Typography component="h1" variant="h3" color="inherit" gutterBottom>
                                {game.name}
                            </Typography>
                            <Typography variant="h5" color="inherit" paragraph>
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
