import React, { Component } from 'react'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import {
    Avatar,
    Chip,
    CircularProgress,
    Container,
    CssBaseline,
    Divider,
    Grid,
    IconButton,
    List,
    Tab,
    Tabs,
    Tooltip,
    Typography,
} from '@material-ui/core'
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail'
import Moment from 'react-moment'
import i18next from 'i18next'
import FavoriteIcon from '@material-ui/icons/Favorite'
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd'
import GamesIcon from '@material-ui/icons/Games'
import SportsEsportsIcon from '@material-ui/icons/SportsEsports'
import EditIcon from '@material-ui/icons/Edit'

import { t } from '../../../i18n'
import { authService, LoggedInUser } from '../../../services/AuthService'
import sStyles from './ProfileContent.module.scss'
import GameListContent from '../../Game/GameListContent/GameListContent'
import { GameList, gameListService, GameListType } from '../../../services/GameListService'
import { gameService } from '../../../services/GameService'
import Centered from '../../Global/Centered/Centered'
import ReviewList from '../ReviewList/ReviewList'
import { User } from '../../../services/UserService'

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
            paddingLeft: 0,
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

    get profileInitials() {
        const { user } = this.props

        return (user.firstName.charAt(0) + (user.lastName?.charAt(0) || '')).toUpperCase()
    }

    get customLists() {
        const { gameLists } = this.state

        return gameLists.filter((it) => it.type === GameListType.Custom)
    }

    get gameListTabs() {
        const { tabIndex, renderedTabs } = this.state
        const { classes } = this.props

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
                                <FavoriteIcon className={sStyles.icon} />
                                {t`user.favorites`}
                            </Typography>
                        }
                    />
                    <Tab
                        className={classes.tab}
                        label={
                            <Typography variant="h6" gutterBottom>
                                <PlaylistAddIcon className={sStyles.icon} />
                                {t`user.wishList`}
                            </Typography>
                        }
                    />
                    <Tab
                        className={classes.tab}
                        label={
                            <Typography variant="h6" gutterBottom>
                                <GamesIcon className={sStyles.icon} />
                                {t`user.playing`}
                            </Typography>
                        }
                    />
                    {this.customLists.map((list) => (
                        <Tab
                            key={list.id}
                            className={classes.tab}
                            label={
                                <Typography variant="h6" gutterBottom>
                                    <SportsEsportsIcon className={sStyles.icon} />
                                    {list.name}
                                    <Tooltip placement="top" title={t`common.edit`}>
                                        <IconButton color="inherit">
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Typography>
                            }
                        />
                    ))}
                </Tabs>
                <Divider />

                <TabPanel value={tabIndex} index={0} renderedTabs={renderedTabs}>
                    {this.renderListByType(GameListType.Favorites)}
                </TabPanel>
                <TabPanel value={tabIndex} index={1} renderedTabs={renderedTabs}>
                    {this.renderListByType(GameListType.Wishlist)}
                </TabPanel>
                <TabPanel value={tabIndex} index={2} renderedTabs={renderedTabs}>
                    {this.renderListByType(GameListType.Playing)}
                </TabPanel>
                {this.customLists.map((list, index) => (
                    <TabPanel key={list.id} value={tabIndex} index={3 + index} renderedTabs={renderedTabs}>
                        {this.renderList(list)}
                    </TabPanel>
                ))}
            </>
        )
    }

    renderListByType = (listType: GameListType) => {
        const { gameLists } = this.state
        const list = gameLists.find((it) => it.type === listType)

        return this.renderList(list)
    }

    renderList = (list?: GameList) => {
        const { classes, user } = this.props

        if (!list) {
            return (
                <Container className={classes.listNotFoundContainer}>
                    <Grid container spacing={0}>
                        <List className={classes.listNotFound}>
                            <Centered>
                                <Typography gutterBottom variant="h5" component="h2">
                                    {t`gameList.noResults`}
                                </Typography>
                            </Centered>
                        </List>
                    </Grid>
                </Container>
            )
        }

        return (
            <GameListContent
                infiniteScroll
                deleteFunction={
                    authService.getCurrentUser()?.id === user.id
                        ? (game) => gameListService.removeFromList(game.id, list?.id)
                        : undefined
                }
                dataFunction={(_, pagination) =>
                    gameService.getAllForList(list.id || '0', pagination.page, pagination.pageSize)
                }
            />
        )
    }

    handleTabChange = (event: React.ChangeEvent<{}>, tabIndex: number) => {
        this.setState((prevState) => ({ tabIndex, renderedTabs: prevState.renderedTabs.add(tabIndex) }))
    }

    render() {
        const { classes, user } = this.props
        const { gameListsLoading } = this.state

        return (
            <>
                <CssBaseline />
                <Container>
                    <Grid container spacing={5} className={classes.mainGrid}>
                        <Grid item lg={12} className="width-full">
                            <Avatar className={sStyles.avatar}>
                                <Typography variant="h3">{this.profileInitials}</Typography>
                            </Avatar>
                            <Typography variant="h5" align="center">
                                {[user.firstName, user.lastName].join(' ')}
                            </Typography>
                        </Grid>

                        <Grid item lg={12} className="width-full">
                            <Typography align="center">
                                <Chip
                                    size="medium"
                                    avatar={
                                        <Avatar>
                                            <AlternateEmailIcon />
                                        </Avatar>
                                    }
                                    label={user.email}
                                    color="primary"
                                />
                            </Typography>
                        </Grid>

                        <Grid item lg={12} className="width-full">
                            <Typography align="center">
                                {t`user.memberSince`}{' '}
                                <Moment locale={i18next.language} format="hh:mm, MMMM Do, YYYY">
                                    {user.createdAt.date}
                                </Moment>
                            </Typography>
                        </Grid>

                        <Grid item lg={12} className="width-full">
                            <Typography variant="h5" align="center">
                                {t`user.gameLists`}
                            </Typography>
                            {gameListsLoading && <CircularProgress />}
                            {!gameListsLoading && this.gameListTabs}
                        </Grid>

                        <Grid item lg={12} className="width-full">
                            <Typography variant="h5" align="center">
                                {t`user.reviews`}
                            </Typography>
                            <ReviewList userId={user.id} />
                        </Grid>
                    </Grid>
                </Container>
            </>
        )
    }
}

export default withRouter(withStyles(styles)(ProfileContent))
