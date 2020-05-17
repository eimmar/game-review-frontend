import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import {
    Container,
    ListItem,
    ListItemAvatar,
    ListItemText,
    List,
    Divider,
    Button,
    CircularProgress,
    Paper,
    FormControl,
    InputLabel,
    Input,
    InputAdornment,
    IconButton,
} from '@material-ui/core'
import { Pagination as PaginationComponent } from '@material-ui/lab'
import Moment from 'react-moment'
import i18next from 'i18next'
import SearchIcon from '@material-ui/icons/Search'

import { t } from '../../../i18n'
import { routes } from '../../../parameters'
import PageLoader from '../../Global/PageLoader'
import { AbstractPaginator, AbstractPaginatorState } from '../../Pagination/AbstractPaginator'
import Centered from '../../Global/Centered/Centered'
import { Pagination } from '../../../services/RequestService'
import { User, WithUser } from '../../../services/UserService'
import { Friendship, friendshipService, FriendshipStatus } from '../../../services/FriendshipService'
import { LoggedInUser } from '../../../services/AuthService'
import UserAvatar from '../../User/Profile/UserAvatar/UserAvatar'
import FriendButton from '../FriendButton/FriendButton'

const styles = ({ palette, spacing, breakpoints }: Theme) =>
    createStyles({
        icon: {
            marginRight: spacing(2),
        },
        cardGrid: {
            padding: 0,
            paddingTop: spacing(4),
        },
        cardMedia: {
            width: 90,
            height: 128,
            margin: 'auto',
        },
        footer: {
            backgroundColor: palette.background.paper,
            padding: spacing(6),
        },
        list: {
            width: '100%',
            backgroundColor: palette.background.paper,
            padding: 0,
            minHeight: 200,
            marginBottom: spacing(2),
        },
        inline: {
            display: 'inline',
        },
        listItem: {
            padding: spacing(2),
            [breakpoints.only('xs')]: {
                display: 'block',
            },
        },
        listAvatar: {
            marginRight: 16,
            [breakpoints.only('xs')]: {
                marginRight: 0,
                marginBottom: 16,
            },
        },
    })

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    infiniteScroll?: boolean
    status?: FriendshipStatus
    currentUser: LoggedInUser
    title: string
    classes: {
        icon: string
        cardGrid: string
        cardMedia: string
        footer: string
        list: string
        inline: string
        listItem: string
        listAvatar: string
    }
}

interface State extends AbstractPaginatorState {
    friendships: Friendship<WithUser>[]
    search: string
    previousSearch: string
}

class FriendListContent extends AbstractPaginator<Props, State> {
    state = {
        friendships: [] as Friendship<WithUser>[],
        pagination: {
            page: 1,
            totalResults: 0,
            pageSize: 20,
        },
        loading: true,
        search: '',
        previousSearch: '',
    }

    componentDidMount() {
        const { pagination } = this.state

        this.fetchData(pagination)
    }

    fetchData = (pagination: Pagination) => {
        const { infiniteScroll, status } = this.props
        let { search } = this.state

        search = search ? search.trim() : search

        this.setState({ loading: true, pagination })

        friendshipService
            .getAll({ ...pagination, filters: { status, search } })
            .then((response) =>
                this.setState((prevState) => {
                    return {
                        friendships: infiniteScroll ? prevState.friendships.concat(response.items) : response.items,
                        previousSearch: search,
                        pagination: {
                            totalResults: response.totalResults,
                            page: pagination.page,
                            pageSize: pagination.pageSize,
                        },
                    }
                }),
            )
            .finally(() => this.setState({ loading: false }))
    }

    handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        const { pagination } = this.state

        this.setState({ pagination: { ...pagination, page } })
    }

    handleRemove = (friend: User) => () => {
        const { friendships } = this.state
        const { currentUser } = this.props

        this.setState({
            friendships: friendships.filter(
                (it) => ![it.sender.id, it.receiver.id].every((e) => [friend.id, currentUser.id].includes(e)),
            ),
        })
    }

    handleQueryChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        event.target !== null && this.setState({ search: event.target.value as string })
    }

    handleSearchSubmit = () => {
        const { pagination, search, previousSearch } = this.state

        if (search.trim() !== previousSearch.trim()) {
            this.setState({ friendships: [] })
            this.fetchData({ ...pagination, page: 1 })
        }
    }

    renderFriendshipDate(friendship: Friendship<WithUser>) {
        if (friendship.acceptedAt) {
            return (
                <Typography component="span" variant="subtitle2" color="textPrimary">
                    {t`friendship.friendSince`}{' '}
                    <Moment locale={i18next.language} format="hh:mm, MMMM Do, YYYY">
                        {friendship.acceptedAt}
                    </Moment>
                </Typography>
            )
        }

        return (
            <Typography component="span" variant="subtitle2" color="textPrimary">
                {t`friendship.requestDate`}{' '}
                <Moment locale={i18next.language} format="hh:mm, MMMM Do, YYYY">
                    {friendship.createdAt}
                </Moment>
            </Typography>
        )
    }

    renderFriendship(friendship: Friendship<WithUser>) {
        const { classes, currentUser } = this.props
        const friend = friendship.sender.id === currentUser.id ? friendship.receiver : friendship.sender

        return (
            <div key={friend.id} data-id="friendship">
                <ListItem alignItems="flex-start" className={classes.listItem}>
                    <ListItemAvatar className={classes.listAvatar}>
                        <Link to={`${routes.user.view}/${friend.username}`}>
                            <UserAvatar user={friend} />
                        </Link>
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                            <Link to={`${routes.user.view}/${friend.username}`}>
                                <Typography gutterBottom variant="subtitle1" component="h2">
                                    <b>{friend.username}</b>
                                </Typography>
                            </Link>
                        }
                        secondary={this.renderFriendshipDate(friendship)}
                    />
                    <FriendButton
                        hideAcceptedButton
                        showSuccess
                        user={friend}
                        initialFriendship={friendship}
                        onAcceptSuccess={this.handleRemove(friend)}
                        onRemoveSuccess={this.handleRemove(friend)}
                    />
                </ListItem>

                <Divider component="li" />
            </div>
        )
    }

    renderSearchBar() {
        const { search } = this.state

        return (
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={8} />
                <Grid item xs={12} sm={6} md={4}>
                    <FormControl fullWidth>
                        <form
                            action=""
                            autoComplete="off"
                            onSubmit={(e) => e.preventDefault()}
                            className="width-full p-r-16 p-l-16"
                        >
                            <InputLabel className="p-r-16 p-l-16">{t`common.search`}</InputLabel>
                            <Input
                                fullWidth
                                name="search"
                                value={search.replace(/\+/g, ' ')}
                                onChange={this.handleQueryChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton onClick={this.handleSearchSubmit} type="submit">
                                            <SearchIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </form>
                    </FormControl>
                </Grid>
            </Grid>
        )
    }

    render() {
        const { classes, infiniteScroll, title } = this.props
        const { friendships, loading, pagination } = this.state

        return (
            <>
                <Container className={classes.cardGrid}>
                    <Grid item lg={12} className="width-full m-b-16">
                        <Paper className="p-t-16 p-b-16">
                            <Typography variant="h5" align="center">
                                {title}
                            </Typography>
                            {this.renderSearchBar()}
                        </Paper>
                    </Grid>

                    <Grid container spacing={0}>
                        <List className={classes.list}>
                            {(!infiniteScroll || (infiniteScroll && pagination.page === 1)) && loading && (
                                <PageLoader />
                            )}
                            {!loading && friendships.length === 0 && (
                                <Centered>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {t`friendship.noResults`}
                                    </Typography>
                                </Centered>
                            )}
                            {(!loading || infiniteScroll) &&
                                friendships.map((friendship) => this.renderFriendship(friendship))}
                        </List>
                    </Grid>
                </Container>

                <Grid container justify="center">
                    {infiniteScroll && this.hasNextPage && !loading && (
                        <Button
                            variant="contained"
                            onClick={() => this.fetchData(this.nextPage)}
                            color="primary"
                        >{t`common.more`}</Button>
                    )}
                    {infiniteScroll && pagination.page > 1 && loading && <CircularProgress />}

                    {!infiniteScroll && (
                        <PaginationComponent
                            color="primary"
                            variant="outlined"
                            page={this.currentPage}
                            count={this.totalPages}
                            onChange={this.handlePageChange}
                            showFirstButton
                            showLastButton
                        />
                    )}
                </Grid>
            </>
        )
    }
}

export default withRouter(withStyles(styles)(FriendListContent))
