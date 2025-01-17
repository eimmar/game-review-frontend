import React from 'react'
import Typography from '@material-ui/core/Typography'
import { Box, CircularProgress, Button, Divider, Grid, CardMedia, ListItemAvatar } from '@material-ui/core'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import { Link } from 'react-router-dom'
import Moment from 'react-moment'
import i18next from 'i18next'

import { t } from '../../../i18n'
import { Pagination } from '../../../services/RequestService'
import { AbstractPaginator, AbstractPaginatorState } from '../../Pagination/AbstractPaginator'
import { routes } from '../../../parameters'
import styles from './UserGridCarousel.module.scss'
import { User, UserFilterRequest, userService } from '../../../services/UserService'
import UserAvatar from '../Profile/UserAvatar/UserAvatar'

interface Props {
    defaultActive?: boolean
    query?: UserFilterRequest
}

interface State extends AbstractPaginatorState {
    users: User[]
    wasActivated: boolean
}

class UserGridCarousel extends AbstractPaginator<Props, State> {
    state: State = {
        users: [],
        pagination: {
            page: 1,
            totalResults: 0,
            pageSize: 7,
        },
        loading: false,
        wasActivated: false,
    }

    componentDidMount(): void {
        const { defaultActive } = this.props

        defaultActive && this.activate()
    }

    get carouselConfig() {
        return {
            superLargeDesktop: {
                breakpoint: { max: 4000, min: 3000 },
                items: 7,
            },
            desktop: {
                breakpoint: { max: 3000, min: 1024 },
                items: 5,
            },
            tablet: {
                breakpoint: { max: 1024, min: 464 },
                items: 3,
            },
            mobile: {
                breakpoint: { max: 464, min: 0 },
                items: 1,
            },
        }
    }

    activate = () => {
        const { wasActivated, pagination } = this.state

        !wasActivated && this.fetchData(pagination)
    }

    fetchData = (pagination: Pagination) => {
        const { query } = this.props
        const nextPageQuery = { ...query, page: String(pagination.page) }

        this.setState({ wasActivated: true, loading: true })
        userService
            .getAllFromFilters(nextPageQuery, pagination.pageSize)
            .then()
            .then((response) => {
                this.setState((prevState) => ({
                    users: prevState.users.concat(response.items),
                    pagination: {
                        totalResults: response.totalResults,
                        page: pagination.page,
                        pageSize: pagination.pageSize,
                    },
                }))
            })
            .finally(() => this.setState({ loading: false }))
    }

    renderUser(user: User, index: number) {
        const { users } = this.state
        const loadMoreCallback =
            index + 1 === users.length && this.hasNextPage ? () => this.fetchData(this.nextPage) : false

        return (
            <Grid item key={index}>
                <div className={styles.card}>
                    <Link to={`${routes.user.view}/${user.username}`}>
                        <CardMedia>
                            <ListItemAvatar>
                                <UserAvatar user={user} />
                            </ListItemAvatar>
                        </CardMedia>
                        <div className={styles.cardContent}>
                            <Typography gutterBottom>{user.username}</Typography>
                            <Typography variant="subtitle2" color="inherit" gutterBottom>
                                {t`user.memberSince`}{' '}
                                <Moment locale={i18next.language} format="MMMM Do, YYYY">
                                    {user.createdAt}
                                </Moment>
                            </Typography>
                        </div>
                    </Link>
                    {loadMoreCallback && (
                        <Button
                            className={styles.loadMore}
                            component="div"
                            variant="contained"
                            onClick={loadMoreCallback}
                            color="secondary"
                        >{t`common.more`}</Button>
                    )}
                </div>
            </Grid>
        )
    }

    render() {
        const { loading, users, wasActivated } = this.state

        return (
            <Box mb={2}>
                <Box mb={1}>
                    <Divider />
                </Box>
                {wasActivated && (
                    <Carousel responsive={this.carouselConfig} className="user-carousel">
                        {users.map((user, index) => this.renderUser(user, index))}
                    </Carousel>
                )}
                {loading && <CircularProgress />}
                {wasActivated && !loading && users?.length === 0 && t`common.noResults`}
                {!wasActivated && (
                    <Button variant="outlined" onClick={this.activate} color="primary">{t`common.more`}</Button>
                )}
            </Box>
        )
    }
}

export default UserGridCarousel
