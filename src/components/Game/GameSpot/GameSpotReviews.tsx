import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import {
    Grid,
    List,
    Box,
    CircularProgress,
    ExpansionPanel,
    ExpansionPanelSummary,
    ExpansionPanelDetails,
    Link,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { t } from '../../../i18n'
import { gameSpotService, Pagination, Review } from '../../../services/GameSpotService'

const styles = () =>
    createStyles({
        classes: {
            review: {
                h1: {
                    component: Typography,
                    props: {
                        gutterBottom: true,
                        variant: 'h5',
                    },
                },
                h2: { component: Typography, props: { gutterBottom: true, variant: 'h6' } },
                h3: { component: Typography, props: { gutterBottom: true, variant: 'subtitle1' } },
                h4: {
                    component: Typography,
                    props: { gutterBottom: true, variant: 'caption', paragraph: true },
                },
                p: { component: Typography, props: { paragraph: true } },
                a: { component: Link },
                li: {
                    component: ({ ...props }) => (
                        <li>
                            <Typography component="span" {...props} />
                        </li>
                    ),
                },
            },
        },
    })

interface Props extends WithStyles<typeof styles> {
    gameId: string
    classes: Record<'classes', string>
}

interface State {
    reviews: Review[]
    pagination: Pagination
    loading: boolean
    wasExpanded: boolean
}

class GameSpotReviews extends Component<Props, State> {
    state: State = {
        reviews: [],
        pagination: {
            page: 1,
            totalResults: 0,
            pageSize: 10,
        },
        loading: true,
        wasExpanded: false,
    }

    expandPanel = () => {
        const { wasExpanded, pagination } = this.state

        !wasExpanded && this.fetchData(pagination)
    }

    fetchData = (pagination: Pagination) => {
        this.setState({ wasExpanded: true, loading: true })

        const { gameId } = this.props

        gameSpotService
            .reviews(gameId, {
                format: 'json',
                limit: pagination.pageSize,
                offset: pagination.pageSize * pagination.page,
                sort: 'publish_date:desc',
            })
            .then((response) => {
                this.setState((prevState) => ({
                    reviews: prevState.reviews.concat(response.results),
                    pagination: {
                        totalResults: response.numberOfTotalResults,
                        page: pagination.page,
                        pageSize: pagination.pageSize,
                    },
                }))
            })
            .finally(() => this.setState({ loading: false }))
    }

    renderReviews() {
        const { reviews, loading } = this.state

        return (
            <List>
                {reviews.map((it) => this.renderReview(it))}
                {!loading && reviews?.length === 0 && t`gameSpotReview.noReviewsFound`}
            </List>
        )
    }

    renderReview(review: Review) {
        const { classes } = this.props

        return (
            <div className={classes.classes}>
                <h1 id="sample-blog-post">{review.title}</h1>
                <h4 id="april-1-2020-by-olivier">
                    April 1, 2020 by <a href="/">Olivier</a>
                </h4>
                <p>
                    This blog post shows a few different types of content that are supported and styled with Material
                    styles. Basic typography, images, and code are all supported. You can extend these by modifying{' '}
                    <code>Markdown.js</code>.
                </p>
                <p>
                    Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean eu leo
                    quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Sed posuere consectetur est at
                    lobortis. Cras mattis consectetur purus sit amet fermentum.
                </p>
                <p>
                    Curabitur blandit tempus porttitor. <strong>Nullam quis risus eget urna mollis</strong> ornare vel
                    eu leo. Nullam id dolor id nibh ultricies vehicula ut id elit.
                </p>
                <p>
                    Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum.
                    Aenean lacinia bibendum nulla sed consectetur.
                </p>
                <h2 id="heading">Heading</h2>
                <p>
                    Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Duis mollis, est non commodo
                    luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Morbi leo risus, porta ac
                    consectetur ac, vestibulum at eros.
                </p>
                <h3 id="sub-heading">Sub-heading</h3>
                <p>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</p>
                <h3 id="sub-heading-1">Sub-heading</h3>
                <p>
                    Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lacinia
                    bibendum nulla sed consectetur. Etiam porta sem malesuada magna mollis euismod. Fusce dapibus,
                    tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.
                </p>
                <ul>
                    <li>Praesent commodo cursus magna, vel scelerisque nisl consectetur et.</li>
                    <li>Donec id elit non mi porta gravida at eget metus.</li>
                    <li>Nulla vitae elit libero, a pharetra augue.</li>
                </ul>
                <p>Donec ullamcorper nulla non metus auctor fringilla. Nulla vitae elit libero, a pharetra augue.</p>
                <ol>
                    <li>Vestibulum id ligula porta felis euismod semper.</li>
                    <li>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.</li>
                    <li>Maecenas sed diam eget risus varius blandit sit amet non magna.</li>
                </ol>
                <p>Cras mattis consectetur purus sit amet fermentum. Sed posuere consectetur est at lobortis.</p>
            </div>
        )
    }

    render() {
        const { loading } = this.state

        return (
            <Grid item>
                <ExpansionPanel onChange={this.expandPanel}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" gutterBottom>{t`gameSpotReview.reviews`}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Box mt={2} mb={2}>
                            {this.renderReviews()}
                            {loading && <CircularProgress />}
                        </Box>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </Grid>
        )
    }
}

export default withStyles(styles)(GameSpotReviews)
