import React, { Component } from 'react'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { Avatar, Button, Container, CssBaseline, DialogActions, Grid, Typography } from '@material-ui/core'
import Moment from 'react-moment'
import i18next from 'i18next'
import FavoriteIcon from '@material-ui/icons/Favorite'
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd'
import GamesIcon from '@material-ui/icons/Games'
import SportsEsportsIcon from '@material-ui/icons/SportsEsports'
import { Link } from 'react-router-dom'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import { toast } from 'react-toastify'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'

import { t } from '../../../i18n'
import GameListContent from '../../Game/GameListContent/GameListContent'
import { GameList, gameListService, GameListType } from '../../../services/GameListService'
import { gameService } from '../../../services/GameService'
import sStyles from './GameListViewContent.module.scss'
import { routes } from '../../../parameters'
import { WithUser } from '../../../services/UserService'
import GameListUpdateForm from '../GameListForm/GameListUpdateForm'
import { authService } from '../../../services/AuthService'
import history from '../../../services/Util/History'

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

interface Props extends WithStyles<typeof styles> {
    gameList: GameList<WithUser>
    classes: {
        mainGrid: string
        listNotFoundContainer: string
        listNotFound: string
        tab: string
    }
}

interface State {
    gameList: GameList<WithUser>
    deleteOpen: boolean
    editOpen: boolean
}

class GameListViewContent extends Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            deleteOpen: false,
            editOpen: false,
            gameList: props.gameList,
        }
    }

    get listIcon() {
        const { gameList } = this.props

        if (gameList.type === GameListType.Favorites) {
            return <FavoriteIcon className={sStyles.icon} />
        }

        if (gameList.type === GameListType.Wishlist) {
            return <PlaylistAddIcon className={sStyles.icon} />
        }

        if (gameList.type === GameListType.Playing) {
            return <GamesIcon className={sStyles.icon} />
        }

        return <SportsEsportsIcon className={sStyles.icon} />
    }

    get listTitle() {
        const { gameList } = this.state

        if (gameList.type === GameListType.Favorites) {
            return t`user.favorites`
        }

        if (gameList.type === GameListType.Wishlist) {
            return t`user.wishList`
        }

        if (gameList.type === GameListType.Playing) {
            return t`user.playing`
        }

        return gameList.name
    }

    get gameListEditFormModal() {
        const { editOpen, gameList } = this.state

        return (
            <Dialog
                open={editOpen}
                onClose={this.handleEditModalToggle}
                scroll="body"
                classes={{ paper: 'width-full' }}
            >
                <DialogTitle>
                    <Typography variant="h5" component="p">{t`common.edit`}</Typography>
                </DialogTitle>
                <DialogContent>
                    <GameListUpdateForm
                        initialValues={gameList}
                        onSuccess={this.handleGameListUpdate}
                        onClose={this.handleEditModalToggle}
                    />
                </DialogContent>
            </Dialog>
        )
    }

    get gameListDeleteModal() {
        const { deleteOpen } = this.state

        return (
            <Dialog open={deleteOpen} onClose={this.handleDeleteModalToggle} scroll="body">
                <DialogTitle>
                    <Typography variant="h5" component="p">{t`gameList.confirmDelete`}</Typography>
                </DialogTitle>
                <DialogActions>
                    <Button type="submit" variant="contained" color="secondary" onClick={this.handleGameListDelete}>
                        {t`common.delete`}
                    </Button>
                    <Button onClick={this.handleDeleteModalToggle} color="primary" variant="outlined">
                        {t`common.cancel`}
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    get renderGameListEditButton() {
        return (
            <Button
                data-id="edit"
                className="m-r-8"
                onClick={this.handleEditModalToggle}
                variant="contained"
                color="primary"
                startIcon={<EditIcon />}
            >
                {t`common.edit`}
            </Button>
        )
    }

    get renderGameListDeleteButton() {
        return (
            <Button
                data-id="delete"
                onClick={this.handleDeleteModalToggle}
                variant="contained"
                color="secondary"
                startIcon={<DeleteIcon />}
            >
                {t`common.delete`}
            </Button>
        )
    }

    handleEditModalToggle = () => this.setState((prevState) => ({ editOpen: !prevState.editOpen }))

    handleDeleteModalToggle = () => this.setState((prevState) => ({ deleteOpen: !prevState.deleteOpen }))

    handleGameListDelete = () => {
        const { gameList } = this.state

        gameListService
            .delete(gameList.id)
            .then(() => {
                toast.success(t`gameList.deleteSuccess`)
                history.push(routes.user.profile)
            })
            .catch(() => toast.error(t`gameList.deleteError`))
    }

    handleGameListUpdate = (gameList: GameList<WithUser>) => {
        this.setState({ gameList })
    }

    render() {
        const { classes } = this.props
        const { gameList } = this.state

        return (
            <>
                <CssBaseline />
                <Container>
                    <Grid container spacing={2} className={classes.mainGrid}>
                        <Grid item lg={12} className="width-full">
                            <Avatar className={sStyles.avatar}>{this.listIcon}</Avatar>
                            <Typography variant="h5" align="center">
                                {this.listTitle}
                            </Typography>
                        </Grid>

                        <Grid item lg={12} className="width-full">
                            <Typography align="center">
                                {gameList.user.enabled && (
                                    <>
                                        {t`common.createdBy`}{' '}
                                        <Link to={`${routes.user.view}/${gameList.user.username}`}>
                                            <b>{gameList.user.username}</b>
                                        </Link>
                                        {', '}
                                    </>
                                )}
                                <Moment locale={i18next.language} format="MMMM Do, YYYY">
                                    {gameList.createdAt}
                                </Moment>
                            </Typography>
                        </Grid>

                        {authService.isCurrentUser(gameList.user) && (
                            <Grid item>
                                {this.renderGameListEditButton}
                                {gameList.type === GameListType.Custom && this.renderGameListDeleteButton}
                            </Grid>
                        )}

                        <Grid item lg={12} className="width-full">
                            <GameListContent
                                infiniteScroll
                                deleteFunction={
                                    authService.isCurrentUser(gameList.user)
                                        ? (game) => gameListService.removeFromList(game.id, gameList.id)
                                        : undefined
                                }
                                dataFunction={(_, limit, offset) =>
                                    gameService.getAllForList(gameList.id, 0, limit, offset)
                                }
                            />
                        </Grid>
                    </Grid>
                </Container>
                {authService.isCurrentUser(gameList.user) && (
                    <>
                        {gameList.type === GameListType.Custom && this.gameListDeleteModal}
                        {this.gameListEditFormModal}
                    </>
                )}
            </>
        )
    }
}

export default withStyles(styles)(GameListViewContent)
