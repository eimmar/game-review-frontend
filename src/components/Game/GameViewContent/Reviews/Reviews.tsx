import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import { RouteComponentProps, withRouter } from 'react-router-dom'
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
} from '@material-ui/core'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ClearIcon from '@material-ui/icons/Clear'
import Rating from '@material-ui/lab/Rating'
import ShowMore from 'react-show-more'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import CheckIcon from '@material-ui/icons/Check'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'

import { Pagination } from '../../../../services/RequestService'
import { GameReview, reviewService } from '../../../../services/GameReviewService'
import ReviewFormModal from '../../Review/ReviewFormModal'
import { t } from '../../../../i18n'
import styles from './Reviews.module.scss'

interface Props extends RouteComponentProps {
    gameId: string
}

interface State {
    reviews: GameReview[]
    pagination: Pagination
    loading: boolean
}

class Reviews extends Component<Props, State> {
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

        reviewService
            .getAllForGame(gameId, pagination)
            .then((response) => {
                this.setState((prevState) => ({
                    reviews: prevState.reviews.concat(response.items),
                    pagination: {
                        totalResults: response.totalResults,
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

    renderReview(review: GameReview) {
        return (
            <Box mt={0} mb={2} key={review.id}>
                <Typography variant="h5" gutterBottom>
                    {review.title}
                </Typography>

                <Typography variant="caption" paragraph gutterBottom>
                    {review.createdAt} {t`common.reviewBy`} {review.user.firstName} {review.user.lastName}
                </Typography>

                {review.rating && this.renderRatingIndicator(review.rating)}

                <List>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <AccountCircleIcon />
                        </ListItemAvatar>
                        <ListItemText
                            primary={review.title}
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
                                            {review.comment}
                                        </Typography>
                                    </ShowMore>
                                </Box>
                            }
                        />
                    </ListItem>

                    {review.pros && (
                        <>
                            <Divider variant="inset" component="li" />
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <ThumbUpIcon className={styles.thumbUp} />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={t`review.good`}
                                    secondary={this.renderTakeawayList(review.pros, <CheckIcon />)}
                                />
                            </ListItem>
                        </>
                    )}

                    {review.cons && (
                        <>
                            <Divider variant="inset" component="li" />
                            <ListItem alignItems="flex-start">
                                <ListItemAvatar>
                                    <ThumbDownIcon color="error" />
                                </ListItemAvatar>
                                <ListItemText
                                    primary={t`review.bad`}
                                    secondary={this.renderTakeawayList(review.cons, <ClearIcon />)}
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
        const { gameId } = this.props
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
                <ReviewFormModal gameId={gameId} />
            </>
        )
    }
}

export default withRouter(Reviews)
