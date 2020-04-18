import * as React from 'react'
import {
    Button,
    IconButton,
    Link as UiLink,
    Menu,
    Toolbar,
    MenuItem,
    Tooltip,
    TextField,
    Hidden,
} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import SearchIcon from '@material-ui/icons/Search'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter, Link } from 'react-router-dom'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import LockIcon from '@material-ui/icons/Lock'
import ContactMailIcon from '@material-ui/icons/ContactMail'
import EditIcon from '@material-ui/icons/Edit'
import SportsEsportsIcon from '@material-ui/icons/SportsEsports'
import PeopleAltIcon from '@material-ui/icons/PeopleAlt'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import MoreVertIcon from '@material-ui/icons/MoreVert'

import { ContentLayout } from '../../layouts/ContentLayout/ContentLayout'
import sStyles from './Header.module.scss'
import { t } from '../../i18n'
import { routes } from '../../parameters'
import { authService } from '../../services/AuthService'
import { mainLogo } from '../../services/Util/AssetsProvider'

const styles = ({ palette, spacing }: Theme) =>
    createStyles({
        toolbar: {
            borderBottom: `1px solid ${palette.divider}`,
        },
        spacer: {
            flex: 1,
        },
        toolbarSecondary: {
            justifyContent: 'space-between',
            overflowX: 'auto',
        },
        toolbarLink: {
            padding: spacing(1),
            flexShrink: 0,
        },
    })

interface Section {
    title: string
    url: string
}

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    sections?: Section[]
    classes: {
        toolbar: string
        spacer: string
        toolbarSecondary: string
        toolbarLink: string
    }
}

class Header extends React.PureComponent<Props> {
    user = authService.getCurrentUser()

    state = {
        profileMenuAnchor: null as HTMLElement | null,
        mobileMainMenuAnchor: null as HTMLElement | null,
        mobileUnregisteredUserMenuAnchor: null as HTMLElement | null,
        query: '',
    }

    componentDidMount(): void {
        const { location } = this.props
        const currentUrlParams = new URLSearchParams(location.search)

        this.setState({ query: currentUrlParams.get('query') || '' })
    }

    handleProfileMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) =>
        this.setState({ profileMenuAnchor: event.target })

    handleProfileMenuClose = () => this.setState({ profileMenuAnchor: null })

    handleMobileMainMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) =>
        this.setState({ mobileMainMenuAnchor: event.target })

    handleMobileMainMenuClose = () => this.setState({ mobileMainMenuAnchor: null })

    handleMobileUnregisteredUserMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) =>
        this.setState({ mobileUnregisteredUserMenuAnchor: event.target })

    handleMobileUnregisteredUserMenuClose = () => this.setState({ mobileUnregisteredUserMenuAnchor: null })

    handleSearchType = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        this.setState({ query: event.target.value })
    }

    handleSearch = () => {
        const { location, history } = this.props
        const { query } = this.state
        const currentUrlParams = new URLSearchParams(location.search)

        if (query.trim()) {
            currentUrlParams.set('query', query.trim())
            currentUrlParams.set('page', '1')
            history.push(`${routes.game.list}?${currentUrlParams.toString()}`)
        }
    }

    renderUserMenuSection = () => {
        const { profileMenuAnchor } = this.state

        return (
            <>
                {!this.user && (
                    <>
                        <Hidden smUp>{this.renderMobileUnregisteredUserMenuSection()}</Hidden>
                        <Hidden xsDown>
                            <Tooltip title={t`header.signIn`}>
                                <IconButton component={Link} to={routes.login}>
                                    <LockOpenIcon />
                                </IconButton>
                            </Tooltip>

                            <Hidden mdUp>
                                <Tooltip title={t`user.register`}>
                                    <IconButton color="primary" component={Link} to={routes.register}>
                                        <AccountCircleIcon />
                                    </IconButton>
                                </Tooltip>
                            </Hidden>

                            <Hidden smDown>
                                <Button variant="outlined" color="primary" component={Link} to={routes.register}>
                                    <AccountCircleIcon className="m-r-8" />
                                    {t`user.register`}
                                </Button>
                            </Hidden>
                        </Hidden>
                    </>
                )}

                {this.user && (
                    <>
                        <Tooltip title={t`header.myProfile`}>
                            <IconButton color="primary" onClick={this.handleProfileMenuOpen}>
                                <Hidden xsDown>
                                    <AccountCircleIcon fontSize="large" />
                                </Hidden>
                                <Hidden smUp>
                                    <AccountCircleIcon />
                                </Hidden>
                            </IconButton>
                        </Tooltip>
                        <Menu
                            anchorEl={profileMenuAnchor}
                            keepMounted
                            open={!!profileMenuAnchor}
                            onClose={this.handleProfileMenuClose}
                        >
                            <MenuItem onClick={this.handleProfileMenuClose} component={Link} to={routes.user.profile}>
                                <ContactMailIcon className="m-r-16" />
                                {t`header.profileInfo`}
                            </MenuItem>
                            <MenuItem
                                onClick={this.handleProfileMenuClose}
                                component={Link}
                                to={routes.user.profileEdit}
                            >
                                <EditIcon className="m-r-16" />
                                {t`header.updateProfile`}
                            </MenuItem>
                            <MenuItem
                                onClick={this.handleProfileMenuClose}
                                component={Link}
                                to={routes.user.changePassword}
                            >
                                <LockIcon className="m-r-16" />
                                {t`header.changePassword`}
                            </MenuItem>
                            <MenuItem onClick={this.handleProfileMenuClose} component={Link} to={routes.logout}>
                                <ExitToAppIcon className="m-r-16" />
                                {t`header.logOut`}
                            </MenuItem>
                        </Menu>
                    </>
                )}
            </>
        )
    }

    renderMobileUnregisteredUserMenuSection = () => {
        const { mobileUnregisteredUserMenuAnchor } = this.state

        return (
            <>
                <IconButton onClick={this.handleMobileUnregisteredUserMenuOpen} color="primary">
                    <AccountCircleIcon />
                </IconButton>
                <Menu
                    anchorEl={mobileUnregisteredUserMenuAnchor}
                    keepMounted
                    open={!!mobileUnregisteredUserMenuAnchor}
                    onClose={this.handleMobileUnregisteredUserMenuClose}
                >
                    <MenuItem onClick={this.handleMobileUnregisteredUserMenuClose} component={Link} to={routes.login}>
                        <LockOpenIcon className="m-r-16" />
                        {t`header.signIn`}
                    </MenuItem>
                    <MenuItem
                        onClick={this.handleMobileUnregisteredUserMenuClose}
                        component={Link}
                        to={routes.register}
                    >
                        <AccountCircleIcon className="m-r-16" />
                        {t`user.register`}
                    </MenuItem>
                </Menu>
            </>
        )
    }

    renderMainMenuSection = () => {
        const { query } = this.state

        return (
            <>
                <form action="" style={{ display: 'contents' }}>
                    <TextField
                        className={sStyles.search}
                        placeholder={t`header.search`}
                        variant="outlined"
                        size="small"
                        value={query}
                        onChange={this.handleSearchType}
                    />
                    <IconButton className={sStyles.searchButton} onClick={this.handleSearch} type="submit">
                        <SearchIcon />
                    </IconButton>
                </form>

                <Hidden xsDown>
                    <Tooltip title={t`user.listHeader`}>
                        <IconButton component={Link} to={routes.user.list}>
                            <PeopleAltIcon />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title={t`header.gameList`}>
                        <IconButton component={Link} to={routes.game.list}>
                            <SportsEsportsIcon />
                        </IconButton>
                    </Tooltip>
                </Hidden>
            </>
        )
    }

    renderMobileMainMenuSection = () => {
        const { mobileMainMenuAnchor } = this.state

        return (
            <>
                <IconButton onClick={this.handleMobileMainMenuOpen}>
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    anchorEl={mobileMainMenuAnchor}
                    keepMounted
                    open={!!mobileMainMenuAnchor}
                    onClose={this.handleMobileMainMenuClose}
                >
                    <MenuItem onClick={this.handleMobileMainMenuClose} component={Link} to={routes.user.list}>
                        <ContactMailIcon className="m-r-16" />
                        {t`user.listHeader`}
                    </MenuItem>
                    <MenuItem onClick={this.handleMobileMainMenuClose} component={Link} to={routes.game.list}>
                        <EditIcon className="m-r-16" />
                        {t`header.gameList`}
                    </MenuItem>
                </Menu>
            </>
        )
    }

    render() {
        const { sections, classes } = this.props

        return (
            <header className={sStyles.header}>
                <ContentLayout>
                    <Toolbar className={classes.toolbar}>
                        <IconButton component={Link} to={routes.homePage}>
                            <img src={mainLogo} width={41} alt={t`common.websiteName`} className="m-r-8" />
                            <Hidden xsDown>
                                <Typography variant="h6">{t`common.websiteName`}</Typography>
                            </Hidden>
                        </IconButton>
                        <div className={classes.spacer} />
                        {this.renderMainMenuSection()}
                        <Hidden smUp>{this.renderMobileMainMenuSection()}</Hidden>
                        {this.renderUserMenuSection()}
                    </Toolbar>
                    <Toolbar component="nav" variant="dense" className={classes.toolbarSecondary}>
                        {sections &&
                            sections.map((section) => (
                                <UiLink
                                    color="inherit"
                                    noWrap
                                    key={section.title}
                                    variant="body2"
                                    href={section.url}
                                    className={classes.toolbarLink}
                                >
                                    {section.title}
                                </UiLink>
                            ))}
                    </Toolbar>
                </ContentLayout>
            </header>
        )
    }
}

export default withRouter(withStyles(styles)(Header))
