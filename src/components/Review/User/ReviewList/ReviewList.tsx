import React from 'react'
import { RouteComponentProps, withRouter, Link as RouterLink } from 'react-router-dom'
import {
    Typography,
    Divider,
    Box,
    List,
    CircularProgress,
    Button,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemIcon,
    Avatar,
    Link,
    Chip,
    DialogActions,
} from '@material-ui/core'
import ClearIcon from '@material-ui/icons/Clear'
import Rating from '@material-ui/lab/Rating'
import ShowMore from 'react-show-more'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import CheckIcon from '@material-ui/icons/Check'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'
import Moment from 'react-moment'
import i18next from 'i18next'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import { toast } from 'react-toastify'

import { Pagination } from '../../../../services/RequestService'
import { GameReview, reviewService } from '../../../../services/GameReviewService'
import { t } from '../../../../i18n'
import styles from './ReviewList.module.scss'
import { AbstractPaginator, AbstractPaginatorState } from '../../../Pagination/AbstractPaginator'
import { placeholderImg } from '../../../../services/Util/AssetsProvider'
import { routes } from '../../../../parameters'
import { authService } from '../../../../services/AuthService'
import ReviewFormModal from '../../ReviewFormModal'

interface Props extends RouteComponentProps {
    userId: string
}

interface State extends AbstractPaginatorState {
    reviews: GameReview[]
    reviewToDelete: GameReview | null
}

class ReviewList extends AbstractPaginator<Props, State> {
    state: State = {
        reviews: [],
        reviewToDelete: null,
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

    fetchData = (pagination: Pagination) => {
        this.setState({ loading: true })

        const { userId } = this.props

        reviewService
            .getAllForUser(userId, pagination)
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

    get reviewDeleteModal() {
        const { reviewToDelete } = this.state

        return (
            <Dialog open={!!reviewToDelete} onClose={() => this.setReviewToDelete(null)} scroll="body">
                <DialogTitle>
                    <Typography variant="h5" component="p">{t`gameReview.confirmDelete`}</Typography>
                </DialogTitle>
                <DialogActions>
                    <Button type="submit" variant="contained" color="secondary" onClick={this.handleDelete}>
                        {t`common.delete`}
                    </Button>
                    <Button onClick={() => this.setReviewToDelete(null)} color="primary" variant="outlined">
                        {t`common.cancel`}
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    setReviewToDelete = (reviewToDelete: GameReview | null) => this.setState({ reviewToDelete })

    handleUpdate = (review: GameReview) => {
        const { reviews } = this.state
        const idx = reviews.findIndex((it) => it.id === review.id)

        if (idx !== -1) {
            const newReviews = [...reviews]

            newReviews[idx] = review

            this.setState({ reviews: newReviews })
        }
    }

    handleDelete = () => {
        const { reviewToDelete } = this.state

        reviewToDelete &&
            reviewService
                .delete(reviewToDelete.id)
                .then(() => {
                    toast.success(t`gameReview.deleteSuccess`)
                    this.setState((prevState) => ({
                        reviews: prevState.reviews.filter((it) => it.id !== reviewToDelete.id),
                        reviewToDelete: null,
                    }))
                })
                .catch(() => toast.error(t`gameReview.deleteError`))
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
                <Typography variant="h6" gutterBottom>
                    {review.title}
                </Typography>
                {!review.approved && (
                    <Chip className="m-r-8 m-t-8" icon={<AccessTimeIcon />} label={t`review.waitingForApproval`} />
                )}
                {authService.isCurrentUser(review.user) && (
                    <>
                        <ReviewFormModal
                            onSuccess={this.handleUpdate}
                            gameId={review.game.id}
                            initialValues={review}
                            button={(onClick) => (
                                <Chip
                                    data-id="edit"
                                    className="m-r-8 m-t-8"
                                    onClick={onClick}
                                    clickable
                                    color="primary"
                                    icon={<EditIcon />}
                                    label={t`common.edit`}
                                />
                            )}
                        />
                        <Chip
                            data-id="delete"
                            className="m-t-8"
                            onClick={() => this.setReviewToDelete(review)}
                            clickable
                            color="secondary"
                            icon={<DeleteIcon />}
                            label={t`common.delete`}
                        />
                    </>
                )}

                <Typography variant="caption" paragraph gutterBottom>
                    <Moment locale={i18next.language} format="hh:mm, MMMM Do, YYYY">
                        {review.createdAt}
                    </Moment>
                </Typography>

                {review.rating && this.renderRatingIndicator(review.rating)}

                <List>
                    <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                            <Link href={`${routes.game.view}/${review.game.slug}`}>
                                <Avatar alt={review.title} src={review.game.coverImage || placeholderImg} />
                            </Link>
                        </ListItemAvatar>
                        <ListItemText
                            primary={
                                <Link to={`${routes.game.view}/${review.game.slug}`} component={RouterLink}>
                                    {review.game.name}
                                </Link>
                            }
                            secondary={
                                <Box mt={1} component="span">
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
                    {this.reviewDeleteModal}
                </Box>
            </>
        )
    }
}

export default withRouter(ReviewList)
