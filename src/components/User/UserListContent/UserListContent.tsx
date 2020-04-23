import React from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import { Container, ListItem, ListItemAvatar, ListItemText, List, Divider, Button } from '@material-ui/core'
import { Pagination as PaginationComponent } from '@material-ui/lab'
import Moment from 'react-moment'
import i18next from 'i18next'

import { t } from '../../../i18n'
import { routes } from '../../../parameters'
import PageLoader from '../../Global/PageLoader'
import { AbstractPaginator, AbstractPaginatorState } from '../../Pagination/AbstractPaginator'
import Centered from '../../Global/Centered/Centered'
import { Pagination } from '../../../services/RequestService'
import { User, userService } from '../../../services/UserService'
import UserAvatar from '../Profile/UserAvatar/UserAvatar'

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
    users: User[]
}

class UserListContent extends AbstractPaginator<Props, State> {
    constructor(props: Props) {
        super(props)
        const currentUrlParams = new URLSearchParams(props.location.search)

        this.state = {
            users: [],
            pagination: {
                page: Number(currentUrlParams.get('page') || 1),
                totalResults: 0,
                pageSize: 10,
            },
            loading: true,
        }
    }

    componentDidMount() {
        const { pagination } = this.state

        this.fetchData(pagination)
    }

    fetchData = (pagination: Pagination) => {
        const { location, infiniteScroll } = this.props

        userService.getAll(location.search, pagination.pageSize).then((response) =>
            this.setState((prevState) => {
                return {
                    users: infiniteScroll ? prevState.users.concat(response.items) : response.items,
                    loading: false,
                    pagination: {
                        totalResults: response.totalResults,
                        page: pagination.page,
                        pageSize: pagination.pageSize,
                    },
                }
            }),
        )
    }

    changePage = () => {
        const { pagination } = this.state
        const { location, history } = this.props
        const currentUrlParams = new URLSearchParams(location.search)

        currentUrlParams.set('page', String(pagination.page))
        history.push(`${location.pathname}?${currentUrlParams.toString()}`)
    }

    handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
        const { pagination } = this.state

        this.setState({ pagination: { ...pagination, page } }, this.changePage)
    }

    render() {
        const { classes, infiniteScroll } = this.props
        const { users, loading } = this.state

        return (
            <>
                <Container className={classes.cardGrid}>
                    <Grid container spacing={0}>
                        <List className={classes.list}>
                            {loading && <PageLoader />}
                            {!loading && users.length === 0 && (
                                <Centered>
                                    <Typography gutterBottom variant="h5" component="h2">
                                        {t`common.noResults`}
                                    </Typography>
                                </Centered>
                            )}
                            {(!loading || infiniteScroll) &&
                                users.map((user) => (
                                    <div key={user.id}>
                                        <ListItem alignItems="flex-start" className={classes.listItem}>
                                            <ListItemAvatar className={classes.listAvatar}>
                                                <Link to={`${routes.user.view}/${user.username}`}>
                                                    <UserAvatar user={user} />
                                                </Link>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Link to={`${routes.user.view}/${user.username}`}>
                                                        <Typography gutterBottom variant="subtitle1" component="h2">
                                                            <b>{user.username}</b>
                                                        </Typography>
                                                    </Link>
                                                }
                                                secondary={
                                                    <Typography
                                                        component="span"
                                                        variant="subtitle2"
                                                        color="textPrimary"
                                                    >
                                                        {t`user.memberSince`}{' '}
                                                        <Moment locale={i18next.language} format="hh:mm, MMMM Do, YYYY">
                                                            {user.createdAt.date}
                                                        </Moment>
                                                    </Typography>
                                                }
                                            />
                                        </ListItem>
                                        <Divider component="li" />
                                    </div>
                                ))}
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

export default withRouter(withStyles(styles)(UserListContent))
