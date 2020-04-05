import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter } from 'react-router-dom'
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
import { Article, gameSpotService, Pagination } from '../../../services/GameSpotService'

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

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    gameId: string
    classes: Record<'classes', string>
}

interface State {
    articles: Article[]
    pagination: Pagination
    loading: boolean
    wasExpanded: boolean
}

class GameSpotArticles extends Component<Props, State> {
    state: State = {
        articles: [],
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
            .articles(gameId, {
                format: 'json',
                limit: pagination.pageSize,
                fieldList: ['title', 'image', 'publish_date', 'authors', 'deck', 'body'],
                offset: pagination.pageSize * pagination.page,
                sort: 'publish_date:desc',
            })
            .then((response) => {
                this.setState((prevState) => ({
                    articles: prevState.articles.concat(response.results),
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
        const { articles, loading } = this.state

        return (
            <List>
                {articles.map((it) => this.renderReview(it))}
                {!loading && articles?.length === 0 && t`gameSpotArticle.noResults`}
            </List>
        )
    }

    renderReview(article: Article) {
        const { classes } = this.props

        return (
            <div className={classes.classes}>
                <h1 id="sample-blog-post">{article.title}</h1>
                <h4 id="april-1-2020-by-olivier">
                    {article.publishDate} <a href="/">{article.authors}</a>
                </h4>
                <img src={article.image?.squareSmall} alt={article.title} />
                <div dangerouslySetInnerHTML={{ __html: article.deck as string }} />
                <div dangerouslySetInnerHTML={{ __html: article.body as string }} />
            </div>
        )
    }

    render() {
        const { loading } = this.state

        return (
            <Grid item>
                <ExpansionPanel onChange={this.expandPanel}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography variant="h6" gutterBottom>{t`gameSpotArticle.items`}</Typography>
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

export default withRouter(withStyles(styles)(GameSpotArticles))
