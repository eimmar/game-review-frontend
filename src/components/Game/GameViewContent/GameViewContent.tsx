import React, { Component } from 'react'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import {
    Grid,
    CssBaseline,
    Container,
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
    Hidden,
} from '@material-ui/core'
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks'
import DescriptionIcon from '@material-ui/icons/Description'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'
import i18next from 'i18next'
import ShowMore from 'react-show-more'

import Sidebar from './Sidebar/Sidebar'
import { GameLoaded } from '../../../services/GameService'
import GameImage from './GameImage'
import ReviewList from '../ReviewList/ReviewList'
import IGDBReviews from '../IGDB/ReviewList/ReviewList'
import { t } from '../../../i18n'
import PriceDeal from '../PriceDeal/PriceDeal'
import GameSpotVideos from '../GameSpot/GameSpotVideos'
import GameSpotReviews from '../GameSpot/GameSpotReviews/GameSpotReviews'
import sStyles from './GameViewContent.module.scss'

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

    get mainInfo() {
        const { game } = this.props

        return (
            <List>
                {game.summary && (
                    <ListItem>
                        <Hidden xsDown>
                            <ListItemAvatar>
                                <Avatar>
                                    <LibraryBooksIcon />
                                </Avatar>
                            </ListItemAvatar>
                        </Hidden>
                        <ListItemText
                            classes={{ secondary: sStyles.content }}
                            primary={t`game.summary`}
                            secondary={
                                <ShowMore
                                    lines={3}
                                    more={
                                        <Typography
                                            display="block"
                                            component="span"
                                            variant="subtitle1"
                                            color="primary"
                                        >{t`common.showMore`}</Typography>
                                    }
                                    less={
                                        <Typography
                                            display="block"
                                            component="span"
                                            variant="subtitle1"
                                            color="primary"
                                        >{t`common.showLess`}</Typography>
                                    }
                                >
                                    {game.summary}
                                </ShowMore>
                            }
                        />
                    </ListItem>
                )}

                {game.storyLine && (
                    <>
                        <Divider variant="inset" component="li" />
                        <ListItem>
                            <Hidden xsDown>
                                <ListItemAvatar>
                                    <Avatar>
                                        <DescriptionIcon />
                                    </Avatar>
                                </ListItemAvatar>
                            </Hidden>
                            <ListItemText
                                classes={{ secondary: sStyles.content }}
                                primary={t`game.storyLine`}
                                secondary={
                                    <ShowMore
                                        lines={3}
                                        more={
                                            <Typography
                                                display="block"
                                                component="span"
                                                variant="subtitle1"
                                                color="primary"
                                            >{t`common.showMore`}</Typography>
                                        }
                                        less={
                                            <Typography
                                                display="block"
                                                component="span"
                                                variant="subtitle1"
                                                color="primary"
                                            >{t`common.showLess`}</Typography>
                                        }
                                    >
                                        {game.storyLine}
                                    </ShowMore>
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
                        label={<Typography variant="h6" gutterBottom>{t`igdbReview.items`}</Typography>}
                    />
                    <Tab
                        className={classes.tab}
                        label={<Typography variant="h6" gutterBottom>{t`gameSpotReview.items`}</Typography>}
                    />
                </Tabs>
                <Divider />
                <TabPanel value={tabIndex} index={0} renderedTabs={renderedTabs}>
                    <ReviewList gameId={game.id} />
                </TabPanel>
                <TabPanel value={tabIndex} index={1} renderedTabs={renderedTabs}>
                    <IGDBReviews gameIgdbId={game.externalId} />
                </TabPanel>
                <TabPanel value={tabIndex} index={2} renderedTabs={renderedTabs}>
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
                        {this.mainInfo}

                        <Box mb={2}>
                            <Typography variant="h6">{t`game.screenshots`}</Typography>
                            <Box mb={1}>
                                <Divider />
                            </Box>
                            <Carousel responsive={this.carouselConfig}>
                                {game.screenshots.length > 0 &&
                                    game.screenshots.map((screenshot) => (
                                        <GameImage key={screenshot.id} image={screenshot} title={game.name} />
                                    ))}
                                {game.screenshots.length === 0 && t`game.noPhotos`}
                            </Carousel>
                        </Box>
                        <GameSpotVideos gameId={game.id} defaultActive />

                        <Grid container spacing={5} className={classes.mainGrid} direction="row-reverse">
                            <Grid item xs={12} md={4}>
                                <Sidebar game={game} />
                            </Grid>
                            <Grid item xs={12} md={8}>
                                <PriceDeal query={game.name} country={i18next.language} />
                                {this.reviewTabs}
                            </Grid>
                        </Grid>
                    </main>
                </Container>
            </>
        )
    }
}

export default withRouter(withStyles(styles)(GameViewContent))
