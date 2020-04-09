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
    Tab,
    Tabs,
} from '@material-ui/core'
import VideogameAssetOutlinedIcon from '@material-ui/icons/VideogameAssetOutlined'
import ComputerIcon from '@material-ui/icons/Computer'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

import Sidebar from './Sidebar'
import { GameLoaded } from '../../../services/GameService'
import GameImage from './GameImage'
import Reviews from '../ReviewList/ReviewList'
import { t } from '../../../i18n'
import PriceDeal from '../PriceDeal/PriceDeal'
import GameSpotVideos from '../GameSpot/GameSpotVideos'
import GameSpotReviews from '../GameSpot/GameSpotReviews/GameSpotReviews'

const styles = ({ spacing }: Theme) =>
    createStyles({
        mainGrid: {
            marginTop: spacing(3),
        },
        tab: {
            textTransform: 'initial',
            textAlign: 'left',
            color: 'inherit',
            paddingLeft: 0,
        },
    })

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    game: GameLoaded
    classes: {
        mainGrid: string
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

class GameViewContent extends Component<Props, State> {
    state = {
        tabIndex: 0,
        renderedTabs: new Set([0]),
    }

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

    get reviewTabs() {
        const { tabIndex, renderedTabs } = this.state
        const { game, classes } = this.props

        return (
            <>
                <Tabs value={tabIndex} indicatorColor="primary" textColor="primary" onChange={this.handleTabChange}>
                    <Tab
                        className={classes.tab}
                        label={<Typography variant="h6" gutterBottom>{t`game.userReviews`}</Typography>}
                    />
                    <Tab
                        className={classes.tab}
                        label={<Typography variant="h6" gutterBottom>{t`gameSpotReview.items`}</Typography>}
                    />
                </Tabs>
                <Divider />
                <TabPanel value={tabIndex} index={0} renderedTabs={renderedTabs}>
                    <Reviews gameId={game.id} />
                </TabPanel>
                <TabPanel value={tabIndex} index={1} renderedTabs={renderedTabs}>
                    <GameSpotReviews gameId={game.id} />
                </TabPanel>
            </>
        )
    }

    get carouselConfig() {
        return {
            superLargeDesktop: {
                breakpoint: { max: 4000, min: 3000 },
                items: 5,
            },
            desktop: {
                breakpoint: { max: 3000, min: 1024 },
                items: 3,
            },
            tablet: {
                breakpoint: { max: 1024, min: 464 },
                items: 2,
            },
            mobile: {
                breakpoint: { max: 464, min: 0 },
                items: 1,
            },
        }
    }

    handleTabChange = (event: React.ChangeEvent<{}>, tabIndex: number) => {
        this.setState((prevState) => ({ tabIndex, renderedTabs: prevState.renderedTabs.add(tabIndex) }))
    }

    render() {
        const { classes, game } = this.props

        return (
            <>
                <CssBaseline />
                <Container>
                    <main>
                        {this.listInfo}

                        {game.screenshots && (
                            <Box mb={2}>
                                <Typography variant="h6">{t`game.screenshots`}</Typography>
                                <Box mb={1}>
                                    <Divider />
                                </Box>
                                <Carousel responsive={this.carouselConfig}>
                                    {game.screenshots.map((screenshot) => (
                                        <GameImage key={screenshot.id} image={screenshot} title={game.name} />
                                    ))}
                                </Carousel>
                            </Box>
                        )}
                        <GameSpotVideos gameId={game.id} />

                        <Grid container spacing={5} className={classes.mainGrid}>
                            <Grid item xs={12} md={8}>
                                <PriceDeal query={game.name} />
                                {this.reviewTabs}
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Sidebar game={game} />
                            </Grid>
                        </Grid>
                    </main>
                </Container>
            </>
        )
    }
}

export default withRouter(withStyles(styles)(GameViewContent))
