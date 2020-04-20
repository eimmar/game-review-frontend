import React, { Component } from 'react'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import { CardMedia, Grid, Dialog, DialogContent, Button } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import Moment from 'react-moment'
import i18next from 'i18next'

import { t } from '../../../i18n'
import { Video } from '../../../services/GameSpotService'
import { placeholderImg } from '../../../services/Util/AssetsProvider'

const styles = () =>
    createStyles({
        card: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            margin: '0 4px',
            cursor: 'pointer',
        },
        cardContent: {
            flexGrow: 1,
            marginTop: 8,
        },
        image: {
            width: '100%',
            height: 135,
            margin: 'auto',
        },
        video: {
            width: '100%',
            height: 'auto',
        },
        modalContent: {
            maxWidth: 900,
            maxHeight: 640,
        },
        loadMore: {
            position: 'absolute',
            top: 40,
            right: 0,
        },
    })

interface Props extends WithStyles<typeof styles> {
    video: Video
    loadMoreCallback?: () => void
    classes: {
        card: string
        cardContent: string
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
                <div className={classes.card}>
                    <CardMedia
                        onClick={this.toggleModal}
                        image={video.image?.screenTiny || placeholderImg}
                        title={video.title}
                        className={classes.image}
                    />
                    <div onClick={this.toggleModal} className={classes.cardContent}>
                        <Typography gutterBottom>{video.title}</Typography>
                        {video.publishDate && (
                            <Typography variant="subtitle2" color="inherit" gutterBottom>
                                <Moment locale={i18next.language} format="MMMM Do, YYYY">
                                    {video.publishDate}
                                </Moment>
                            </Typography>
                        )}
                    </div>
                    {loadMoreCallback && (
                        <Button
                            className={classes.loadMore}
                            component="div"
                            variant="contained"
                            onClick={loadMoreCallback}
                            color="secondary"
                        >{t`common.more`}</Button>
                    )}
                </div>
                <Dialog open={modalOpen} onClose={this.toggleModal} maxWidth="xl" scroll="body">
                    <DialogContent className={classes.modalContent}>
                        <CardMedia>
                            <video className={classes.video} controls title={video.title}>
                                <source src={video.highUrl || video.hdUrl || video.lowUrl} />
                                <track kind="captions" />
                                {video.deck}
                            </video>
                            <Typography gutterBottom>{video.title}</Typography>
                            {video.publishDate && (
                                <Typography variant="subtitle2" color="inherit" gutterBottom>
                                    <Moment locale={i18next.language} format="MMMM Do, YYYY">
                                        {video.publishDate}
                                    </Moment>
                                </Typography>
                            )}
                        </CardMedia>
                    </DialogContent>
                </Dialog>
            </Grid>
        )
    }
}

export default withStyles(styles)(GameSpotVideo)
