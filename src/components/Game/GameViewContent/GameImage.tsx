import React, { Component } from 'react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { CardActionArea, CardMedia, Grid, Dialog, DialogContent } from '@material-ui/core'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import { gameService, Screenshot, ScreenshotSize } from '../../../services/GameService'

const styles = () =>
    createStyles({
        card: {
            display: 'flex',
        },
        cardDetails: {
            flex: 1,
        },
        image: {
            width: '100%',
            height: 'auto',
        },
        modalContent: {
            maxWidth: 960,
            maxHeight: 540,
            overflow: 'hidden',
        },
    })

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    image: Screenshot
    title: string
    classes: {
        card: string
        cardDetails: string
        image: string
        modalContent: string
    }
}

interface State {
    modalOpen: boolean
}

class GameImage extends Component<Props, State> {
    state = {
        modalOpen: false,
    }

    toggleModal = () => this.setState((prevState) => ({ modalOpen: !prevState.modalOpen }))

    render() {
        const { image, title, classes } = this.props
        const { modalOpen } = this.state

        return (
            <Grid item>
                <CardActionArea component="a" onClick={this.toggleModal}>
                    <CardMedia>
                        <LazyLoadImage
                            className={classes.image}
                            alt={title}
                            src={gameService.transformImage(
                                image.url,
                                ScreenshotSize.Thumb,
                                ScreenshotSize.ScreenshotMed,
                            )}
                        />
                    </CardMedia>
                </CardActionArea>
                <Dialog open={modalOpen} onClose={this.toggleModal} maxWidth="xl" scroll="body">
                    <DialogContent className={classes.modalContent}>
                        <CardMedia>
                            <img
                                className={classes.image}
                                src={gameService.transformImage(image.url, ScreenshotSize.Thumb, ScreenshotSize.P1080)}
                                alt={title}
                            />
                        </CardMedia>
                    </DialogContent>
                </Dialog>
            </Grid>
        )
    }
}

export default withRouter(withStyles(styles)(GameImage))
