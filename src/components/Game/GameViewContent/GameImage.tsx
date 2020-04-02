import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Grid, CardActionArea, Card, CardContent, Hidden, CardMedia } from '@material-ui/core'

import { Screenshot } from '../../../services/GameService'

const styles = () =>
    createStyles({
        card: {
            display: 'flex',
        },
        cardDetails: {
            flex: 1,
        },
        cardMedia: {
            width: 160,
        },
    })

interface Post {
    title: string
    date: string
    description: string
    image: string
    imageText: string
}

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    image: Screenshot
    title: string
    classes: {
        card: string
        cardDetails: string
        cardMedia: string
    }
}

// eslint-disable-next-line react/prefer-stateless-function
class GameImage extends Component<Props> {
    render() {
        const { image, title, classes } = this.props

        return (
            <Grid item xs={12} md={6}>
                <CardActionArea component="a" href="#">
                    <Card className={classes.card}>
                        {/* <div className={classes.cardDetails}> */}
                        {/*    <CardContent> */}
                        {/*        <Typography component="h2" variant="h5"> */}
                        {/*            {image.title} */}
                        {/*        </Typography> */}
                        {/*        <Typography variant="subtitle1" color="textSecondary"> */}
                        {/*            {image.date} */}
                        {/*        </Typography> */}
                        {/*        <Typography variant="subtitle1" paragraph> */}
                        {/*            {image.description} */}
                        {/*        </Typography> */}
                        {/*    </CardContent> */}
                        {/* </div> */}
                        <CardMedia className={classes.cardMedia} image={image.url} title={title} />
                    </Card>
                </CardActionArea>
            </Grid>
        )
    }
}

export default withRouter(withStyles(styles)(GameImage))
