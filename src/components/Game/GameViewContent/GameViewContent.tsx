import React, { Component } from 'react'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Grid, CssBaseline, Container } from '@material-ui/core'
import GitHubIcon from '@material-ui/icons/GitHub'
import TwitterIcon from '@material-ui/icons/Twitter'
import FacebookIcon from '@material-ui/icons/Facebook'

import Sidebar from './Sidebar'
import { GameLoaded } from '../../../services/GameService'
import MainSection from './MainSection'
import GameImage from './GameImage'
import Reviews from './Reviews'

const styles = ({ spacing }: Theme) =>
    createStyles({
        mainGrid: {
            marginTop: spacing(3),
        },
    })

interface Post {
    title: string
    date: string
    description: string
    image: string
    imageTitle: string
}

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    game: GameLoaded
    classes: {
        mainGrid: string
    }
}

// eslint-disable-next-line react/prefer-stateless-function
class GameViewContent extends Component<Props> {
    render() {
        const { classes, game } = this.props

        const sidebar = {
            title: 'About',
            description:
                'Etiam porta sem malesuada magna mollis euismod. Cras mattis consectetur purus sit amet fermentum. Aenean lacinia bibendum nulla sed consectetur.',
            archives: [
                { title: 'March 2020', url: '#' },
                { title: 'February 2020', url: '#' },
                { title: 'January 2020', url: '#' },
                { title: 'November 1999', url: '#' },
                { title: 'October 1999', url: '#' },
                { title: 'September 1999', url: '#' },
                { title: 'August 1999', url: '#' },
                { title: 'July 1999', url: '#' },
                { title: 'June 1999', url: '#' },
                { title: 'May 1999', url: '#' },
                { title: 'April 1999', url: '#' },
            ],
            social: [
                { name: 'GitHub', icon: GitHubIcon },
                { name: 'Twitter', icon: TwitterIcon },
                { name: 'Facebook', icon: FacebookIcon },
            ],
        }

        return (
            <>
                <CssBaseline />
                <Container>
                    <main>
                        <MainSection game={game} />
                        <Grid container spacing={4}>
                            {game.screenshots.map((screenshot) => (
                                <GameImage key={screenshot.id} image={screenshot} title={game.name} />
                            ))}
                        </Grid>
                        <Grid container spacing={5} className={classes.mainGrid}>
                            <Reviews gameId={game.id} />
                            <Sidebar
                                ageRatings={game.ageRatings}
                                themes={game.themes}
                                gameModes={game.gameModes}
                                websites={game.websites}
                                companies={game.companies}
                            />
                        </Grid>
                    </main>
                </Container>
            </>
        )
    }
}

export default withRouter(withStyles(styles)(GameViewContent))
