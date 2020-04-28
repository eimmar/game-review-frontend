import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import {
    CircularProgress,
    DialogActions,
    IconButton,
    List,
    ListItem,
    PropTypes,
    Tooltip,
    ListItemIcon,
    ListItemText,
    Checkbox,
} from '@material-ui/core'
import FavoriteIcon from '@material-ui/icons/Favorite'
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd'
import GamesIcon from '@material-ui/icons/Games'
import ListIcon from '@material-ui/icons/List'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import DialogContent from '@material-ui/core/DialogContent'
import Button from '@material-ui/core/Button'
import AddIcon from '@material-ui/icons/Add'
import { toast } from 'react-toastify'

import { t } from '../../../i18n'
import { GameList, gameListService, GameListType } from '../../../services/GameListService'
import { authenticatedAction, authService } from '../../../services/AuthService'
import GameListCreateForm from '../GameListForm/GameListCreateForm'
import styles from './GameListTab.module.scss'

interface Props {
    gameId: string
}

interface State {
    inFavorites: boolean
    inWishList: boolean
    inPlaying: boolean
    loading: boolean
    gameListsWithGame: GameList[]
    userGameLists: GameList[]
    modalOpen: boolean
    formOpen: boolean
}

interface ListActionConfig {
    onClick: () => void
    color: PropTypes.Color
    tooltip: string
}

class GameListTab extends Component<Props, State> {
    user = authService.getCurrentUser()

    state = {
        inFavorites: false,
        inWishList: false,
        inPlaying: false,
        loading: true,
        gameListsWithGame: [] as GameList[],
        userGameLists: [] as GameList[],
        modalOpen: false,
        formOpen: false,
    }

    addToList = authenticatedAction((listType: GameListType) => {
        const { gameId } = this.props
        const list = this.getPredefinedList(listType)

        this.setState({ loading: true })
        gameListService
            .addToList(gameId, list.id)
            .then(() => {
                switch (listType) {
                    case GameListType.Wishlist:
                        this.setState({ inWishList: true })
                        break
                    case GameListType.Playing:
                        this.setState({ inPlaying: true })
                        break
                    case GameListType.Favorites:
                        this.setState({ inFavorites: true })
                        break
                    default:
                        break
                }
            })
            .finally(() => this.setState({ loading: false }))
    })

    removeFromList = authenticatedAction((listType: GameListType) => {
        const { gameId } = this.props
        const list = this.getPredefinedList(listType)

        this.setState({ loading: true })
        gameListService
            .removeFromList(gameId, list.id)
            .then(() => {
                switch (listType) {
                    case GameListType.Wishlist:
                        this.setState({ inWishList: false })
                        break
                    case GameListType.Playing:
                        this.setState({ inPlaying: false })
                        break
                    case GameListType.Favorites:
                        this.setState({ inFavorites: false })
                        break
                    default:
                        break
                }
            })
            .finally(() => this.setState({ loading: false }))
    })

    toggleGameInList = authenticatedAction((list: GameList) => {
        const { gameListsWithGame } = this.state
        const { gameId } = this.props

        if (this.gameInList(list.id)) {
            gameListService.removeFromList(gameId, list.id).then((it) => {
                toast.info(t('gameList.successRemove'))
                this.setState({ gameListsWithGame: gameListsWithGame.filter((it2) => it2.id !== it.id) })
            })
        } else {
            gameListService.addToList(gameId, list.id).then((it) => {
                toast.info(t('gameList.successAdd'))
                this.setState({ gameListsWithGame: gameListsWithGame.concat(it) })
            })
        }
    })

    handleModalToggle = authenticatedAction(() => this.setState((prevState) => ({ modalOpen: !prevState.modalOpen })))

    componentDidMount() {
        const { gameId } = this.props

        if (this.user) {
            gameListService
                .getUserListsContainingGame(this.user.id, gameId)
                .then((gameListsWithGame) => {
                    const inFavorites = !!gameListsWithGame.find((it) => it.type === GameListType.Favorites)
                    const inWishList = !!gameListsWithGame.find((it) => it.type === GameListType.Wishlist)
                    const inPlaying = !!gameListsWithGame.find((it) => it.type === GameListType.Playing)

                    this.setState({ inFavorites, inWishList, inPlaying, gameListsWithGame })
                })
                .finally(() => this.setState({ loading: false }))

            gameListService.getAllForUser(this.user.id).then((userGameLists) => this.setState({ userGameLists }))
        } else {
            this.setState({ loading: false })
        }
    }

    get customLists() {
        const { userGameLists } = this.state

        return userGameLists.filter((it) => it.type === GameListType.Custom)
    }

    getPredefinedList = (listType: GameListType) => {
        const { userGameLists } = this.state

        return userGameLists.find((it) => it.type === listType) as GameList
    }

    gameInList = (listId: string) => {
        const { gameListsWithGame } = this.state

        return !!gameListsWithGame.find((it) => it.id === listId)
    }

    handleListCreateSuccess = (list: GameList) => {
        this.setState((prevState) => ({
            gameListsWithGame: prevState.gameListsWithGame.concat(list),
            userGameLists: prevState.userGameLists.concat(list),
        }))
    }

    handleFormToggle = () => this.setState((prevState) => ({ formOpen: !prevState.formOpen }))

    renderCustomLists() {
        const lists = this.customLists
        const { modalOpen, formOpen } = this.state
        const { gameId } = this.props

        return (
            <>
                <Tooltip placement="top" title={t`gameList.customLists`}>
                    <IconButton color="inherit" onClick={this.handleModalToggle}>
                        <ListIcon />
                    </IconButton>
                </Tooltip>
                <Dialog
                    open={modalOpen}
                    onClose={this.handleModalToggle}
                    aria-labelledby="form-dialog-title"
                    scroll="body"
                >
                    <DialogTitle>
                        <Typography variant="h5" component="p">{t`gameList.customLists`}</Typography>
                    </DialogTitle>
                    <DialogContent className={styles.dialog}>
                        <List style={{ maxHeight: 300 }} dense>
                            {lists.map((list) => (
                                <ListItem button key={list.id} onClick={() => this.toggleGameInList(list)}>
                                    <ListItemIcon>
                                        <Checkbox
                                            size="small"
                                            color="primary"
                                            edge="start"
                                            checked={this.gameInList(list.id)}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText primary={list.name} />
                                </ListItem>
                            ))}
                            {lists.length === 0 && t`gameList.noItems`}
                        </List>
                    </DialogContent>
                    {formOpen && (
                        <DialogContent className={styles.dialog}>
                            <GameListCreateForm
                                gameId={gameId}
                                onSuccess={this.handleListCreateSuccess}
                                onClose={this.handleFormToggle}
                            />
                        </DialogContent>
                    )}
                    <DialogActions style={{ justifyContent: 'space-between' }}>
                        {!formOpen && (
                            <>
                                <Button startIcon={<AddIcon />} onClick={this.handleFormToggle} variant="outlined">
                                    {t`gameList.new`}
                                </Button>
                                <Button onClick={this.handleModalToggle} color="secondary" variant="contained">
                                    {t`common.close`}
                                </Button>
                            </>
                        )}
                    </DialogActions>
                </Dialog>
            </>
        )
    }

    render() {
        const { loading, inFavorites, inWishList, inPlaying } = this.state
        const favorites: ListActionConfig = {
            onClick: () =>
                inFavorites ? this.removeFromList(GameListType.Favorites) : this.addToList(GameListType.Favorites),
            color: inFavorites ? 'primary' : 'inherit',
            tooltip: inFavorites ? t`gameList.removeFromFavorites` : t`gameList.addToFavorites`,
        }
        const wishList: ListActionConfig = {
            onClick: () => {
                inWishList ? this.removeFromList(GameListType.Wishlist) : this.addToList(GameListType.Wishlist)
            },
            color: inWishList ? 'primary' : 'inherit',
            tooltip: inWishList ? t`gameList.removeFromWishList` : t`gameList.addToWishList`,
        }
        const playing: ListActionConfig = {
            onClick: () =>
                inPlaying ? this.removeFromList(GameListType.Playing) : this.addToList(GameListType.Playing),
            color: inPlaying ? 'primary' : 'inherit',
            tooltip: inPlaying ? t`gameList.removeFromPlaying` : t`gameList.addToPlaying`,
        }

        return (
            <>
                {loading && <CircularProgress />}
                {!loading && (
                    <Grid container data-id="game-lists">
                        <Tooltip placement="top" title={favorites.tooltip}>
                            <IconButton color={favorites.color} onClick={favorites.onClick}>
                                <FavoriteIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip placement="top" title={wishList.tooltip}>
                            <IconButton color={wishList.color} onClick={wishList.onClick}>
                                <PlaylistAddIcon />
                            </IconButton>
                        </Tooltip>

                        <Tooltip placement="top" title={playing.tooltip}>
                            <IconButton color={playing.color} onClick={playing.onClick}>
                                <GamesIcon />
                            </IconButton>
                        </Tooltip>

                        {this.renderCustomLists()}
                    </Grid>
                )}
            </>
        )
    }
}

export default GameListTab
