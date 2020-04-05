import React, { Component } from 'react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import { CardActionArea, CardMedia, Grid, Dialog, DialogContent, Button } from '@material-ui/core'

import { Video } from '../../../services/GameSpotService'
import { t } from '../../../i18n'

const styles = () =>
    createStyles({
        card: {
            display: 'flex',
        },
        cardDetails: {
            flex: 1,
        },
        image: {
            width: 240,
            height: 135,
        },
        video: {
            width: '100%',
            height: 'auto',
        },
        modalContent: {
            maxWidth: 900,
            maxHeight: 540,
        },
        loadMore: {
            position: 'absolute',
            top: 52,
            right: 0,
        },
    })

interface Props extends WithStyles<typeof styles> {
    video: Video
    loadMoreCallback?: () => void
    classes: {
        card: string
        cardDetails: string
        image: string
        video: string
        modalContent: string
        loadMore: string
    }
}

interface State {
    modalOpen: boolean
}

class GameSpotVideo extends Component<Props, State> {
    state = {
        modalOpen: false,
    }

    toggleModal = () => this.setState((prevState) => ({ modalOpen: !prevState.modalOpen }))

    render() {
        const { video, classes, loadMoreCallback } = this.props
        const { modalOpen } = this.state

        return (
            <Grid item>
                <CardActionArea component="div">
                    <CardMedia>
                        <img
                            className={classes.image}
                            alt={video.title}
                            src={video.image?.screenTiny}
                            onClick={this.toggleModal}
                        />
                        {loadMoreCallback && (
                            <Button
                                className={classes.loadMore}
                                component="div"
                                variant="contained"
                                onClick={loadMoreCallback}
                                color="secondary"
                            >{t`common.more`}</Button>
                        )}
                    </CardMedia>
                </CardActionArea>
                <Dialog open={modalOpen} onClose={this.toggleModal} maxWidth="xl">
                    <DialogContent className={classes.modalContent}>
                        <CardMedia>
                            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
                            <video className={classes.video} controls>
                                <source src={video.highUrl || video.hdUrl || video.lowUrl} />
                                {video.deck}
                            </video>
                        </CardMedia>
                    </DialogContent>
                </Dialog>
            </Grid>
        )
    }
}

export default withStyles(styles)(GameSpotVideo)
