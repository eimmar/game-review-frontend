import React, { Component } from 'react'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import {
    Grid,
    CssBaseline,
    Container,
    Link,
    Typography,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Box,
} from '@material-ui/core'
import VideogameAssetOutlinedIcon from '@material-ui/icons/VideogameAssetOutlined'
import ComputerIcon from '@material-ui/icons/Computer'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'

import Sidebar from './Sidebar'
import { GameLoaded } from '../../../services/GameService'
import MainSection from './MainSection'
import GameImage from './GameImage'
import Reviews from './Reviews'
import { t } from '../../../i18n'

const styles = ({ spacing }: Theme) =>
    createStyles({
        mainGrid: {
            marginTop: spacing(3),
        },
    })

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    game: GameLoaded
    classes: {
        mainGrid: string
    }
}

class GameViewContent extends Component<Props> {
    get listInfo() {
        const { game } = this.props

        return (
            <List>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <VideogameAssetOutlinedIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={t`game.genres`}
                        secondary={game.genres.map((genre) => (
                            <Box mr={1} key={genre.id} display="inline" component="span">
                                <Link variant="body1" href={genre.url}>
                                    {genre.name}
                                </Link>
                            </Box>
                        ))}
                    />
                </ListItem>
                <Divider variant="inset" component="li" />
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <ComputerIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={t`game.platforms`}
                        secondary={game.platforms.map((platform) => (
                            <Box mr={1} key={platform.id} display="inline" component="span">
                                <Link variant="body1" href={platform.url}>
                                    {platform.name}
                                </Link>
                            </Box>
                        ))}
                    />
                </ListItem>

                {game.storyLine && (
                    <>
                        <Divider variant="inset" component="li" />
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>
                                    <LibraryBooksIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={t`game.storyLine`}
                                secondary={
                                    <Typography variant="subtitle1" color="inherit" paragraph component="span">
                                        {game.storyLine}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    </>
                )}
            </List>
        )
    }

    render() {
        const { classes, game } = this.props

        return (
            <>
                <CssBaseline />
                <Container>
                    <main>
                        <MainSection game={game} />
                        {this.listInfo}

                        <Grid container spacing={4}>
                            {game.screenshots.map((screenshot) => (
                                <GameImage key={screenshot.id} image={screenshot} title={game.name} />
                            ))}
                        </Grid>

                        <Grid container spacing={5} className={classes.mainGrid}>
                            <Typography variant="subtitle1" color="inherit" paragraph>
                                {game.storyLine}
                            </Typography>

                            <Reviews gameId={game.id} />
                            <Sidebar game={game} />
                        </Grid>
                    </main>
                </Container>
            </>
        )
    }
}

export default withRouter(withStyles(styles)(GameViewContent))
