import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Component } from 'react'
import { Button, Container, Drawer, Grid, Hidden, Typography } from '@material-ui/core'
import SubjectIcon from '@material-ui/icons/Subject'
import CloseIcon from '@material-ui/icons/Close'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import GameListContent from '../../components/Game/GameListContent/GameListContent'
import GamesFilter from '../../components/Game/GamesFilter/GamesFilter'
import { t } from '../../i18n'
import { igdbService } from '../../services/IGDBService'

interface State {
    mobileDrawerOpen: boolean
}

interface Props extends RouteComponentProps {}

class GameList extends Component<Props, State> {
    state = {
        mobileDrawerOpen: false,
    }

    componentDidMount(): void {
        document.title = `${t`pageTitle.gameList`} - ${t`common.websiteName`}`
    }

    handleMobileDrawerToggle = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return
        }

        this.setState({ mobileDrawerOpen: open })
    }

    renderMobileDrawer = () => {
        const { mobileDrawerOpen } = this.state
        const { location } = this.props

        return (
            <>
                <Button
                    onClick={this.handleMobileDrawerToggle(true)}
                    startIcon={<SubjectIcon />}
                    variant="contained"
                    color="primary"
                >
                    {t`common.filters`}
                </Button>
                <Drawer anchor="top" open={mobileDrawerOpen} onClose={this.handleMobileDrawerToggle(false)}>
                    <GamesFilter key={location.key} />
                    <Container>
                        <Grid item>
                            <Button
                                onClick={this.handleMobileDrawerToggle(false)}
                                startIcon={<CloseIcon />}
                                variant="contained"
                                fullWidth
                                style={{ maxWidth: 300 }}
                                color="primary"
                                className="m-b-64"
                            >
                                {t`common.close`}
                            </Button>
                        </Grid>
                    </Container>
                </Drawer>
            </>
        )
    }

    render() {
        const { location } = this.props

        return (
            <MainLayout>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Typography component="h1" variant="h4" align="center" color="textPrimary" gutterBottom>
                            {t`game.listHeader`}
                        </Typography>
                    </Grid>

                    <Grid item xs={12} sm={12} md={4} lg={3}>
                        <Hidden smDown>
                            <GamesFilter key={location.key} />
                        </Hidden>
                        <Hidden mdUp>{this.renderMobileDrawer()}</Hidden>
                    </Grid>
                    <Grid item xs={12} sm={12} md={8} lg={9}>
                        <GameListContent
                            key={location.key}
                            dataFunction={(search, limit, offset) =>
                                igdbService.getAllFromSearch(search, limit, offset)
                            }
                        />
                    </Grid>
                </Grid>
            </MainLayout>
        )
    }
}

export default withRouter(GameList)
