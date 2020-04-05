import React, { Component } from 'react'
import {
    List,
    Box,
    CircularProgress,
    Link,
    Divider,
    ListItem,
    Typography,
    ListItemAvatar,
    Avatar,
    ListItemText,
    ListItemIcon,
    Button,
} from '@material-ui/core'
import Rating from '@material-ui/lab/Rating'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import CheckIcon from '@material-ui/icons/Check'
import ClearIcon from '@material-ui/icons/Clear'
import ShowMore from 'react-show-more'

import { t } from '../../../i18n'
import { gameSpotService, Pagination, Review } from '../../../services/GameSpotService'
import styles from './GameSpotReviews.module.scss'

interface Props {
    gameId: string
}

interface State {
    reviews: Review[]
    pagination: Pagination
    loading: boolean
}

class GameSpotReviews extends Component<Props, State> {
    state: State = {
        reviews: [],
        pagination: {
            page: 1,
            totalResults: 0,
            pageSize: 5,
        },
        loading: true,
    }

    componentDidMount(): void {
        const { pagination } = this.state

        this.fetchData(pagination)
    }

    get hasNextPage() {
        const { pagination } = this.state

        return pagination.page * pagination.pageSize < pagination.totalResults
    }

    get nextPage() {
        const { pagination } = this.state

        return { ...pagination, page: pagination.page + 1 }
    }

    fetchData = (pagination: Pagination) => {
        this.setState({ loading: true })

        const { gameId } = this.props

        gameSpotService
            .reviews(gameId, {
                format: 'json',
                limit: pagination.pageSize,
                fieldList: ['publish_date', 'id', 'authors', 'title', 'image', 'score', 'deck', 'good', 'bad', 'body'],
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

    renderRatingIndicator = (rating: number) => {
        return (
            <>
                <Typography variant="h6">{rating}/10</Typography>
                <Rating value={rating} max={10} readOnly />
            </>
        )
    }

    renderReview(review: Review) {
        return (
            <Box mt={0} mb={2} key={review.id}>
                <Typography variant="h5" gutterBottom>
                    {review.title}
                </Typography>

                <Typography variant="caption" paragraph gutterBottom>
                    {review.publishDate} by{' '}
                    <Link href={`https://www.google.com/search?q=${review.authors}`} target="_blank">
                        {review.authors}
                    </Link>
                </Typography>

                {review.score && this.renderRatingIndicator(Number(review.score))}

                <List>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Avatar alt={review.title} src={review.image?.screenTiny} />
                        </ListItemAvatar>
                        <ListItemText
                            primary={review.deck}
                            secondary={
                                <Box mt={1} style={{ color: 'initial' }} component="span">
                                    <ShowMore
                                        lines={6}
                                        more={
                                            <Typography
                                                display="block"
                                                component="span"
                                                variant="subtitle1"
                                                className={styles.inline}
                                                color="primary"
                                            >{t`common.showMore`}</Typography>
                                        }
                                        less={
                                            <Typography
                                                display="block"
                                                component="span"
                                                variant="subtitle1"
                                                className={styles.inline}
                                                color="primary"
                                            >{t`common.showLess`}</Typography>
                                        }
                                    >
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            className={styles.inline}
                                            color="textPrimary"
                                        >
                                            <Box
                                                component="span"
                                                className={styles.reviewContent}
                                                dangerouslySetInnerHTML={{ __html: review.body as string }}
                                            />
                                        </Typography>
                                    </ShowMore>
                                </Box>
                            }
                        />
                    </ListItem>

                    {review.good && (
                        <>
                            <Divider variant="inset" component="li" />
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <ThumbUpIcon className={styles.thumbUp} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={t`review.good`}
                                    secondary={this.renderTakeawayList(review.good, <CheckIcon />)}
                                />
                            </ListItem>
                        </>
                    )}

                    {review.bad && (
                        <>
                            <Divider variant="inset" component="li" />
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <ThumbDownIcon color="error" />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={t`review.bad`}
                                    secondary={this.renderTakeawayList(review.bad, <ClearIcon />)}
                                />
                            </ListItem>
                        </>
                    )}
                </List>
            </Box>
        )
    }

    renderTakeawayList = (content: string, icon: React.ReactElement) => {
        return (
            <Typography component="span" variant="body2" className={styles.inline} color="textPrimary">
                <List dense>
                    {content?.split('|').map((it) => (
                        <ListItem key={it}>
                            <ListItemIcon>{icon}</ListItemIcon>
                            <ListItemText primary={it} />
                        </ListItem>
                    ))}
                </List>
            </Typography>
        )
    }

    render() {
        const { loading, reviews } = this.state

        return (
            <Box mt={0} mb={2}>
                <List>
                    {reviews.map((it) => this.renderReview(it))}
                    {!loading && reviews?.length === 0 && t`gameSpotReview.noItems`}
                    {loading && <CircularProgress />}
                    {!loading && this.hasNextPage && (
                        <Button
                            variant="contained"
                            onClick={() => this.fetchData(this.nextPage)}
                            color="primary"
                        >{t`common.more`}</Button>
                    )}
                </List>
            </Box>
        )
    }
}

export default GameSpotReviews
