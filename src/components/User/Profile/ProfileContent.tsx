import React, { Component } from 'react'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { Link, RouteComponentProps, withRouter } from 'react-router-dom'
import {
    Avatar,
    Button,
    Chip,
    CircularProgress,
    Container,
    CssBaseline,
    DialogActions,
    Divider,
    Grid,
    List,
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
import EditIcon from '@material-ui/icons/Edit'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DeleteIcon from '@material-ui/icons/Delete'
import { toast } from 'react-toastify'
import PageviewIcon from '@material-ui/icons/Pageview'

import { t } from '../../../i18n'
import { authService, LoggedInUser } from '../../../services/AuthService'
import sStyles from './ProfileContent.module.scss'
import GameListContent from '../../Game/GameListContent/GameListContent'
import { GameList, gameListService, GameListType } from '../../../services/GameListService'
import { gameService } from '../../../services/GameService'
import Centered from '../../Global/Centered/Centered'
import ReviewList from '../../Review/User/ReviewList/ReviewList'
import { User, userService } from '../../../services/UserService'
import GameListUpdateForm from '../../GameList/GameListForm/GameListUpdateForm'
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
    gameListInEdit: GameList | null
    gameListInDelete: GameList | null
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
        gameListInEdit: null as GameList | null,
        gameListInDelete: null as GameList | null,
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
                        {this.renderGameListViewButton(list)}
                        {this.isCurrentUser && (
                            <>
                                {this.renderGameListEditButton(list)}
                                <Button
                                    className={sStyles.deleteAction}
                                    onClick={() => this.setGameListInDelete(list)}
                                    variant="contained"
                                    color="secondary"
                                    startIcon={<DeleteIcon />}
                                >
                                    {t`common.delete`}
                                </Button>
                            </>
                        )}
                        {this.renderList(list)}
                    </TabPanel>
                ))}
            </>
        )
    }

    get isCurrentUser() {
        const { user } = this.props

        return authService.isCurrentUser(user)
    }

    get gameListEditFormModal() {
        const { gameListInEdit } = this.state

        if (!gameListInEdit) {
            return ''
        }

        return (
            <Dialog
                open={!!gameListInEdit}
                onClose={() => this.setGameListInEdit(null)}
                scroll="body"
                classes={{ paper: 'width-full' }}
            >
                <DialogTitle>
                    <Typography variant="h5">{t`common.edit`}</Typography>
                </DialogTitle>
                <DialogContent>
                    <GameListUpdateForm
                        initialValues={gameListInEdit}
                        onSuccess={this.updateListState}
                        onClose={() => this.setGameListInEdit(null)}
                    />
                </DialogContent>
            </Dialog>
        )
    }

    get gameListDeleteModal() {
        const { gameListInDelete } = this.state

        if (!gameListInDelete) {
            return ''
        }

        return (
            <Dialog open={!!gameListInDelete} onClose={() => this.setGameListInDelete(null)} scroll="body">
                <DialogTitle>
                    <Typography variant="h5">{t`gameList.confirmDelete`}</Typography>
                </DialogTitle>
                <DialogActions>
                    <Button
                        type="submit"
                        variant="contained"
                        color="secondary"
                        onClick={() => this.handleGameListDelete(gameListInDelete)}
                    >
                        {t`common.delete`}
                    </Button>
                    <Button onClick={() => this.setGameListInDelete(null)} color="primary" variant="outlined">
                        {t`common.cancel`}
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    setGameListInEdit = (list: GameList | null) => this.setState({ gameListInEdit: list })

    setGameListInDelete = (list: GameList | null) => this.setState({ gameListInDelete: list })

    handleGameListDelete = (list: GameList) => {
        gameListService
            .delete(list.id)
            .then(() => {
                toast.success(t`gameList.deleteSuccess`)
                this.setState((prevState) => ({
                    gameLists: prevState.gameLists.filter((it) => it.id !== list.id),
                    gameListInDelete: null,
                    tabIndex: 0,
                }))
            })
            .catch(() => toast.error(t`gameList.deleteError`))
    }

    handleTabChange = (event: React.ChangeEvent<{}>, tabIndex: number) => {
        this.setState((prevState) => ({ tabIndex, renderedTabs: prevState.renderedTabs.add(tabIndex) }))
    }

    updateListState = (list: GameList) => {
        const { gameLists } = this.state

        this.setState({ gameLists: gameLists.map((it) => (it.id === list.id ? list : it)) })
    }

    renderListByType = (listType: GameListType) => {
        const { classes } = this.props
        const { gameLists } = this.state
        const list = gameLists.find((it) => it.type === listType)

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
            <>
                {this.renderGameListViewButton(list)}
                {this.isCurrentUser && this.renderGameListEditButton(list)}
                {this.renderList(list)}
            </>
        )
    }

    renderGameListViewButton = (list: GameList) => {
        return (
            <Button
                component={Link}
                to={`${routes.gameList.view}/${list.id}`}
                className={sStyles.viewAction}
                variant="contained"
                color="default"
                startIcon={<PageviewIcon />}
            >
                {t`common.view`}
            </Button>
        )
    }

    renderGameListEditButton = (list: GameList) => {
        return (
            <Button
                className={sStyles.editAction}
                onClick={() => this.setGameListInEdit(list)}
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
            >
                {t`common.edit`}
            </Button>
        )
    }

    renderList = (list: GameList) => {
        return (
            <div className="m-t-24">
                <GameListContent
                    infiniteScroll
                    deleteFunction={
                        this.isCurrentUser ? (game) => gameListService.removeFromList(game.id, list?.id) : undefined
                    }
                    dataFunction={(_, pagination) =>
                        gameService.getAllForList(list.id || '0', pagination.page, pagination.pageSize)
                    }
                />
            </div>
        )
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

                        {this.isCurrentUser && (
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
                            {!gameListsLoading && this.gameListTabs}
                        </Grid>

                        <Grid item lg={12} className="width-full">
                            <Typography variant="h5" align="center">
                                {t`user.reviews`}
                            </Typography>
                            <ReviewList userId={user.id} />
                        </Grid>
                    </Grid>
                    {this.isCurrentUser && (
                        <>
                            {this.gameListEditFormModal}
                            {this.gameListDeleteModal}
                        </>
                    )}
                </Container>
            </>
        )
    }
}

export default withRouter(withStyles(styles)(ProfileContent))
