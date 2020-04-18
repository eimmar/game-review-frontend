import React, { Component } from 'react'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { Avatar, Chip, Container, CssBaseline, Grid, Typography } from '@material-ui/core'
import Moment from 'react-moment'
import i18next from 'i18next'
import FavoriteIcon from '@material-ui/icons/Favorite'
import PlaylistAddIcon from '@material-ui/icons/PlaylistAdd'
import GamesIcon from '@material-ui/icons/Games'
import SportsEsportsIcon from '@material-ui/icons/SportsEsports'
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail'
import { Link } from 'react-router-dom'

import { t } from '../../../i18n'
import GameListContent from '../../Game/GameListContent/GameListContent'
import { GameList, GameListType, WithUser } from '../../../services/GameListService'
import { gameService } from '../../../services/GameService'
import sStyles from './GameListViewContent.module.scss'
import { routes } from '../../../parameters'
import { userService } from '../../../services/UserService'

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

class GameListViewContent extends Component<Props> {
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
        const { gameList } = this.props

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

    render() {
        const { classes, gameList } = this.props

        return (
            <>
                <CssBaseline />
                <Container>
                    <Grid container spacing={5} className={classes.mainGrid}>
                        <Grid item lg={12} className="width-full">
                            <Avatar className={sStyles.avatar}>{this.listIcon}</Avatar>
                            <Typography variant="h5" align="center">
                                {this.listTitle}
                            </Typography>
                        </Grid>

                        <Grid item lg={12} className="width-full">
                            <Typography align="center">
                                {t`common.createdBy`}{' '}
                                <Link to={`${routes.user.view}/${gameList.user.id}`}>
                                    <b>{userService.getFullName(gameList.user)}</b>
                                </Link>
                                {', '}
                                <Moment locale={i18next.language} format="MMMM Do, YYYY">
                                    {gameList.createdAt}
                                </Moment>
                            </Typography>
                        </Grid>

                        <Grid item lg={12} className="width-full">
                            <GameListContent
                                infiniteScroll
                                dataFunction={(_, pagination) =>
                                    gameService.getAllForList(gameList.id, pagination.page, pagination.pageSize)
                                }
                            />
                        </Grid>
                    </Grid>
                </Container>
            </>
        )
    }
}

export default withStyles(styles)(GameListViewContent)
