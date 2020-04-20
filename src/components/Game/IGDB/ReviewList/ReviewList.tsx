import React from 'react'
import Typography from '@material-ui/core/Typography'
import {
    Divider,
    Box,
    List,
    CircularProgress,
    Button,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemIcon,
    Link,
} from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Clear'
import Rating from '@material-ui/lab/Rating'
import ShowMore from 'react-show-more'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import CheckIcon from '@material-ui/icons/Check'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import Moment from 'react-moment'
import i18next from 'i18next'

import { Pagination } from '../../../../services/RequestService'
import { t } from '../../../../i18n'
import styles from './ReviewList.module.scss'
import { AbstractPaginator, AbstractPaginatorState } from '../../../Pagination/AbstractPaginator'
import { igdbReviews } from '../../../../parameters'
import { igdbService, Review } from '../../../../services/IGDBService'

interface Props {
    gameIgdbId: number
}

interface State extends AbstractPaginatorState {
    reviews: Review[]
    tryNextPage: boolean
}

class ReviewList extends AbstractPaginator<Props, State> {
    state: State = {
        reviews: [],
        tryNextPage: false,
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
        const { tryNextPage } = this.state

        return tryNextPage
    }

    fetchData = (pagination: Pagination) => {
        this.setState({ loading: true })

        const { gameIgdbId } = this.props

        igdbService
            .reviews(gameIgdbId, pagination)
            .then((response) => {
                this.setState((prevState) => ({
                    reviews: prevState.reviews.concat(response),
                    tryNextPage: response.length === pagination.pageSize,
                    pagination: {
                        totalResults: 0,
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
                <Typography variant="h6" gutterBottom>
                    {review.title}
                </Typography>

                <Typography variant="caption" paragraph gutterBottom>
                    <Moment locale={i18next.language} format="hh:mm, MMMM Do, YYYY">
                        {review.createdAt * 1000}
                    </Moment>{' '}
                    {t`common.reviewBy`}{' '}
                    <Link href={igdbReviews} target="_blank">
                        {t`igdb.userReview`}
                    </Link>
                </Typography>

                {review.userRating && this.renderRatingIndicator(review.userRating.rating)}

                <List>
                    <ListItem alignItems="flex-start" disableGutters>
                        <ListItemText
                            classes={{ secondary: styles.reviewContent }}
                            primary={review.content}
                            secondary={
                                <Box mt={1} component="span">
                                    {review.video && (
                                        <div className={styles.videoContainer}>
                                            <embed
                                                src={review.video.url.replace('youtu.be', 'youtube.com/embed')}
                                                width="853"
                                                height="480"
                                            />
                                        </div>
                                    )}

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
                                            {review.conclusion}
                                        </Typography>
                                    </ShowMore>
                                </Box>
                            }
                        />
                    </ListItem>

                    {review.positivePoints && (
                        <>
                            <Divider variant="inset" component="li" />
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <ThumbUpIcon className={styles.thumbUp} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={t`review.good`}
                                    secondary={this.renderTakeawayList(review.positivePoints, <CheckIcon />)}
                                />
                            </ListItem>
                        </>
                    )}

                    {review.negativePoints && (
                        <>
                            <Divider variant="inset" component="li" />
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <ThumbDownIcon color="error" />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={t`review.bad`}
                                    secondary={this.renderTakeawayList(review.negativePoints, <ClearIcon />)}
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
                    {content
                        .split(/\r?\n/)
                        .filter(Boolean)
                        .map((it) => (
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
            <>
                <Box mt={0} mb={2}>
                    <List>
                        {reviews.map((it) => this.renderReview(it))}
                        {!loading && reviews?.length === 0 && t`gameReview.noItems`}
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
            </>
        )
    }
}

export default ReviewList
