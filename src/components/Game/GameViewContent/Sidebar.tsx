import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Badge, Link, Paper } from '@material-ui/core'
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'

import {
    AgeRating,
    Company,
    GameMode,
    gameService,
    GameWebsite,
    Theme as GameTheme,
} from '../../../services/GameService'
import { t } from '../../../i18n'

const styles = ({ palette, spacing }: Theme) =>
    createStyles({
        sidebarAboutBox: {
            padding: spacing(2),
            backgroundColor: palette.grey[200],
        },
        sidebarSection: {
            marginTop: spacing(3),
        },
    })

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    ageRatings: AgeRating[]
    themes: GameTheme[]
    gameModes: GameMode[]
    websites: GameWebsite[]
    companies: Company[]

    classes: {
        sidebarAboutBox: string
        sidebarSection: string
    }
}

// eslint-disable-next-line react/prefer-stateless-function
class Sidebar extends Component<Props> {
    render() {
        const { classes, ageRatings, themes, gameModes, websites, companies } = this.props

        return (
            <Grid item xs={12} md={4}>
                <Paper elevation={0} className={classes.sidebarAboutBox}>
                    <Typography variant="h6" gutterBottom>
                        {t`game.information`}
                    </Typography>
                    <Typography>{t`some info`}</Typography>
                </Paper>

                <Typography variant="h6" gutterBottom className={classes.sidebarSection}>
                    {t`game.ageRatings`}
                </Typography>
                {ageRatings.map((ageRating) => (
                    <Link display="block" variant="body1" href="#" key={ageRating.id}>
                        {ageRating.rating}
                    </Link>
                ))}

                <Typography variant="h6" gutterBottom className={classes.sidebarSection}>
                    {t`game.themes`}
                </Typography>
                {themes.map((theme) => (
                    <Link display="block" variant="body1" href={theme.url} key={theme.id}>
                        {theme.name}
                    </Link>
                ))}

                <Typography variant="h6" gutterBottom className={classes.sidebarSection}>
                    {t`game.gameModes`}
                </Typography>
                {gameModes.map((gameMode) => (
                    <Link display="block" variant="body1" href={gameMode.url} key={gameMode.id}>
                        {gameMode.name}
                    </Link>
                ))}

                <Typography variant="h6" gutterBottom className={classes.sidebarSection}>
                    {t`game.companies`}
                </Typography>
                {companies.map((company) => (
                    <div key={company.id}>
                        <Link display="block" variant="body1" href={company.url}>
                            {company.name} - {company.description}
                        </Link>
                        {company.websites.map((companyWebsite) => '')}
                    </div>
                ))}

                <Typography variant="h6" gutterBottom className={classes.sidebarSection}>
                    {t`game.websites`}
                </Typography>
                {websites.map((website) => (
                    <Link display="block" variant="body1" href={website.url} key={website.id}>
                        <Grid container direction="row" spacing={1} alignItems="center">
                            <Grid item>{gameService.getWebsiteIcon(website.category)}</Grid>
                            <Grid item>
                                {website.category}
                                {website.trusted && (
                                    <Badge>
                                        <VerifiedUserIcon />
                                    </Badge>
                                )}
                            </Grid>
                        </Grid>
                    </Link>
                ))}
            </Grid>
        )
    }
}

export default withRouter(withStyles(styles)(Sidebar))
