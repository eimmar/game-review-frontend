import React, { Component } from 'react'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import {
    Avatar,
    Chip,
    CircularProgress,
    Container,
    CssBaseline,
    Divider,
    Grid,
    Paper,
    Tab,
    Tabs,
    Typography,
} from '@material-ui/core'
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail'
import Moment from 'react-moment'
import i18next from 'i18next'
import FavoriteIcon from '@material-ui/icons/Favorite'
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd'
import GamesIcon from '@material-ui/icons/Games'
import SportsEsportsIcon from '@material-ui/icons/SportsEsports'
import RateReviewIcon from '@material-ui/icons/RateReview'

import { t } from '../../../i18n'
import { authService, LoggedInUser } from '../../../services/AuthService'
import sStyles from './ProfileContent.module.scss'
import { GameList, gameListService, GameListType } from '../../../services/GameListService'
import ReviewList from '../../Review/User/ReviewList/ReviewList'
import { User, userService } from '../../../services/UserService'
import { routes } from '../../../parameters'
import UserAvatar from './UserAvatar/UserAvatar'

const styles = ({ spacing, palette }: Theme) =>
    createStyles({
        mainGrid: {
            marginTop: spacing(3),
        },
        listNotFoundContainer: {
            padding: 0,
            paddingTop: spacing(4),
        },
        listNotFound: {
            width: '100%',
            backgroundColor: palette.background.paper,
            padding: 0,
            minHeight: 200,
            marginBottom: spacing(2),
        },
        tab: {
            textTransform: 'initial',
            textAlign: 'left',
            color: 'inherit',
            paddingLeft: 16,
            minWidth: 'inherit',
        },
    })

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    user: User | LoggedInUser
    classes: {
        mainGrid: string
        listNotFoundContainer: string
        listNotFound: string
        tab: string
    }
}

interface TabPanelProps {
    children?: React.ReactNode
    index: any
    value: any
    renderedTabs: Set<number>
}

interface State {
    gameLists: GameList[]
    gameListsLoading: boolean
    tabIndex: number
    renderedTabs: Set<number>
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, renderedTabs, ...other } = props

    return (
        <Typography component="div" role="tabpanel" hidden={value !== index} {...other}>
            {(value === index || renderedTabs.has(index)) && children}
        </Typography>
    )
}

class ProfileContent extends Component<Props, State> {
    state = {
        gameLists: [] as GameList[],
        gameListsLoading: true,
        tabIndex: 0,
        renderedTabs: new Set([0]),
    }

    componentDidMount() {
        const { user } = this.props

        gameListService
            .getAllForUser(user.id)
            .then((gameLists) => this.setState({ gameLists }))
            .finally(() => this.setState({ gameListsLoading: false }))
    }

    get customLists() {
        const { gameLists } = this.state

        return gameLists.filter((it) => it.type === GameListType.Custom)
    }

    get tabs() {
        const { tabIndex, renderedTabs } = this.state
        const { classes, user } = this.props

        return (
            <>
                <Tabs
                    value={tabIndex}
                    indicatorColor="primary"
                    textColor="primary"
                    onChange={this.handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    <Tab
                        className={classes.tab}
                        label={
                            <Typography variant="h6" gutterBottom>
                                <SportsEsportsIcon className={sStyles.icon} />
                                {t`user.gameLists`}
                            </Typography>
                        }
                    />
                    <Tab
                        className={classes.tab}
                        label={
                            <Typography variant="h6" gutterBottom>
                                <RateReviewIcon className={sStyles.icon} />
                                {t`user.reviews`}
                            </Typography>
                        }
                    />
                </Tabs>
                <Divider />

                <TabPanel value={tabIndex} index={0} renderedTabs={renderedTabs}>
                    <Grid container spacing={2} className="m-t-8">
                        {this.renderListByType(GameListType.Favorites)}
                        {this.renderListByType(GameListType.Wishlist)}
                        {this.renderListByType(GameListType.Playing)}
                        {this.customLists.map((list) => (
                            <Grid item key={list.id}>
                                <Paper>
                                    <Typography
                                        className={sStyles.gameList}
                                        variant="h6"
                                        component={Link}
                                        to={`${routes.gameList.view}/${list.id}`}
                                    >
                                        <SportsEsportsIcon className="m-r-8" />
                                        {list.name}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </TabPanel>
                <TabPanel value={tabIndex} index={1} renderedTabs={renderedTabs}>
                    <ReviewList userId={user.id} />
                </TabPanel>
            </>
        )
    }

    handleTabChange = (event: React.ChangeEvent<{}>, tabIndex: number) => {
        this.setState((prevState) => ({ tabIndex, renderedTabs: prevState.renderedTabs.add(tabIndex) }))
    }

    renderListByType = (listType: GameListType) => {
        const { gameLists } = this.state
        const list = gameLists.find((it) => it.type === listType)

        if (!list) {
            return ''
        }

        return (
            <>
                <Grid item>
                    <Paper>
                        <Typography
                            className={sStyles.gameList}
                            variant="h6"
                            gutterBottom
                            component={Link}
                            to={`${routes.gameList.view}/${list.id}`}
                        >
                            {this.renderListTitle(listType)}
                        </Typography>
                    </Paper>
                </Grid>
            </>
        )
    }

    renderListTitle = (listType: GameListType) => {
        if (listType === GameListType.Favorites) {
            return (
                <>
                    <FavoriteIcon className="m-r-8" />
                    {t`user.favorites`}
                </>
            )
        }

        if (listType === GameListType.Wishlist) {
            return (
                <>
                    <PlaylistAddIcon className="m-r-8" />
                    {t`user.wishList`}
                </>
            )
        }

        if (listType === GameListType.Playing) {
            return (
                <>
                    <GamesIcon className="m-r-8" />
                    {t`user.playing`}
                </>
            )
        }

        return ''
    }

    render() {
        const { classes, user } = this.props
        const { gameListsLoading } = this.state

        return (
            <>
                <CssBaseline />
                <Container>
                    <Grid container spacing={1} className={classes.mainGrid}>
                        <Grid item lg={12} className="width-full">
                            <UserAvatar user={user} />
                            <Typography variant="h5" align="center">
                                {user.username}
                            </Typography>
                            <Typography variant="subtitle1" align="center">
                                {userService.getFullName(user)}
                            </Typography>
                        </Grid>

                        {authService.isCurrentUser(user) && (
                            <Grid item lg={12} className="width-full">
                                <Typography align="center">
                                    <Chip
                                        component="span"
                                        size="medium"
                                        avatar={
                                            <Avatar component="span">
                                                <AlternateEmailIcon />
                                            </Avatar>
                                        }
                                        label={user.email}
                                        color="primary"
                                    />
                                </Typography>
                            </Grid>
                        )}

                        <Grid item lg={12} className="width-full">
                            <Typography align="center">
                                {t`user.memberSince`}{' '}
                                <Moment locale={i18next.language} format="MMMM Do, YYYY">
                                    {user.createdAt.date}
                                </Moment>
                            </Typography>
                        </Grid>

                        <Grid item lg={12} className="width-full">
                            {gameListsLoading && <CircularProgress />}
                            {!gameListsLoading && this.tabs}
                        </Grid>
                    </Grid>
                </Container>
            </>
        )
    }
}

export default withRouter(withStyles(styles)(ProfileContent))
