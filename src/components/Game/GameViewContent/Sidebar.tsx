import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter, Link as RouterLink } from 'react-router-dom'
import { Badge, Link, Paper, Tooltip } from '@material-ui/core'
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser'
import LanguageIcon from '@material-ui/icons/Language'
import SportsEsportsIcon from '@material-ui/icons/SportsEsports'
import LocalLibraryIcon from '@material-ui/icons/LocalLibrary'
import MenuBookIcon from '@material-ui/icons/MenuBook'
import FacebookIcon from '@material-ui/icons/Facebook'
import TwitterIcon from '@material-ui/icons/Twitter'
import InstagramIcon from '@material-ui/icons/Instagram'
import YouTubeIcon from '@material-ui/icons/YouTube'
import PhoneIphoneIcon from '@material-ui/icons/PhoneIphone'
import AndroidIcon from '@material-ui/icons/Android'
import RedditIcon from '@material-ui/icons/Reddit'

import { t } from '../../../i18n'
import { GameLoaded, GameWebsiteCategory } from '../../../services/GameService'

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
    game: GameLoaded
    classes: {
        sidebarAboutBox: string
        sidebarSection: string
    }
}

class Sidebar extends Component<Props> {
    getWebsiteIcon(category: GameWebsiteCategory) {
        let icon: React.ReactNode

        switch (category) {
            case GameWebsiteCategory.Official:
                icon = <SportsEsportsIcon />
                break

            case GameWebsiteCategory.Wikia:
                icon = <LocalLibraryIcon />
                break

            case GameWebsiteCategory.Wikipedia:
                icon = <MenuBookIcon />
                break

            case GameWebsiteCategory.Facebook:
                icon = <FacebookIcon />
                break

            case GameWebsiteCategory.Twitter:
                icon = <TwitterIcon />
                break

            case GameWebsiteCategory.Twitch:
                icon = <LanguageIcon />
                break

            case GameWebsiteCategory.Instagram:
                icon = <InstagramIcon />
                break

            case GameWebsiteCategory.Youtube:
                icon = <YouTubeIcon />
                break

            case GameWebsiteCategory.Iphone:
                icon = <PhoneIphoneIcon />
                break

            case GameWebsiteCategory.Ipad:
                icon = <LanguageIcon />
                break

            case GameWebsiteCategory.Android:
                icon = <AndroidIcon />
                break

            case GameWebsiteCategory.Steam:
                icon = <LanguageIcon />
                break

            case GameWebsiteCategory.Reddit:
                icon = <RedditIcon />
                break

            case GameWebsiteCategory.Itch:
                icon = <LanguageIcon />
                break

            case GameWebsiteCategory.EpicGames:
                icon = <LanguageIcon />
                break

            case GameWebsiteCategory.Gog:
                icon = <LanguageIcon />
                break

            default:
                icon = <LanguageIcon />
                break
        }

        return icon
    }

    render() {
        const { classes, game } = this.props

        return (
            <>
                {game.category !== 0 && (
                    <Paper elevation={0} className={classes.sidebarAboutBox}>
                        <Typography variant="h6" gutterBottom>
                            {t`game.category`}
                        </Typography>
                        <Typography>{t(`gameCategory.${game.category}`)}</Typography>
                    </Paper>
                )}

                <Typography variant="h6" gutterBottom className={classes.sidebarSection}>
                    {t`game.ageRatings`}
                </Typography>
                {game.ageRatings.length > 0 &&
                    game.ageRatings.map((ageRating) => (
                        <Typography display="block" variant="body1" key={ageRating.id}>
                            {t(`ageRating.category_${ageRating.category}`)} {t(`ageRating.${ageRating.rating}`)}
                        </Typography>
                    ))}
                {game.ageRatings.length === 0 && t`game.noInfo`}

                <Typography variant="h6" gutterBottom className={classes.sidebarSection}>
                    {t`game.themes`}
                </Typography>
                {game.themes.length > 0 &&
                    game.themes.map((theme) => (
                        <Link display="block" variant="body1" component={RouterLink} to={theme.url} key={theme.id}>
                            {theme.name}
                        </Link>
                    ))}
                {game.themes.length === 0 && t`game.noInfo`}

                <Typography variant="h6" gutterBottom className={classes.sidebarSection}>
                    {t`game.genres`}
                </Typography>
                {game.genres.length > 0 &&
                    game.genres.map((genre) => (
                        <Link display="block" variant="body1" component={RouterLink} to={genre.url} key={genre.id}>
                            {genre.name}
                        </Link>
                    ))}
                {game.genres.length === 0 && t`game.noInfo`}

                <Typography variant="h6" gutterBottom className={classes.sidebarSection}>
                    {t`game.gameModes`}
                </Typography>
                {game.gameModes.length > 0 &&
                    game.gameModes.map((gameMode) => (
                        <Link
                            display="block"
                            variant="body1"
                            component={RouterLink}
                            to={gameMode.url}
                            key={gameMode.id}
                        >
                            {gameMode.name}
                        </Link>
                    ))}
                {game.gameModes.length === 0 && t`game.noInfo`}

                <Typography variant="h6" gutterBottom className={classes.sidebarSection}>
                    {t`game.companies`}
                </Typography>
                {game.companies.length > 0 &&
                    game.companies.map((company) => (
                        <div key={company.id}>
                            <Link display="block" variant="body1" href={company.url} target="_blank">
                                {company.name}
                            </Link>
                        </div>
                    ))}
                {game.companies.length === 0 && t`game.noInfo`}

                {game.websites.length > 0 && (
                    <>
                        <Typography variant="h6" gutterBottom className={classes.sidebarSection}>
                            {t`game.websites`}
                        </Typography>
                        {game.websites.map((website) => (
                            <Link display="block" variant="body1" href={website.url} key={website.id} target="_blank">
                                <Grid container direction="row" spacing={1} alignItems="center">
                                    <Grid item>{this.getWebsiteIcon(website.category)}</Grid>
                                    <Grid item>
                                        {t(`gameWebsite.cateogry_${website.category}`)}
                                        {website.trusted && (
                                            <Tooltip title={t`gameWebsite.trusted`}>
                                                <Badge>
                                                    <VerifiedUserIcon />
                                                </Badge>
                                            </Tooltip>
                                        )}
                                    </Grid>
                                </Grid>
                            </Link>
                        ))}
                    </>
                )}
            </>
        )
    }
}

export default withRouter(withStyles(styles)(Sidebar))
