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
    Drawer,
    Divider,
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
import CloseIcon from '@material-ui/icons/Close'
import PeopleIcon from '@material-ui/icons/People'
import PersonAddIcon from '@material-ui/icons/PersonAdd'

import { ContentLayout } from '../../layouts/ContentLayout/ContentLayout'
import sStyles from './Header.module.scss'
import { t } from '../../i18n'
import { routes } from '../../parameters'
import { authService } from '../../services/AuthService'
import { mainLogo } from '../../services/Util/AssetsProvider'
import UserAvatar from '../User/Profile/UserAvatar/UserAvatar'

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
        query: '',
        mobileDrawerOpen: false,
    }

    userMenu = [
        { route: routes.user.profile, title: t`header.profileInfo`, icon: ContactMailIcon, dataId: 'profile' },
        { route: routes.user.profileEdit, title: t`header.updateProfile`, icon: EditIcon, dataId: 'profileEdit' },
        { route: routes.user.friendList, title: t`friendship.list`, icon: PeopleIcon, dataId: 'friendList' },
        {
            route: routes.user.friendInvites,
            title: t`friendship.invites`,
            icon: PersonAddIcon,
            dataId: 'friendInvites',
        },
        {
            route: routes.user.changePassword,
            title: t`header.changePassword`,
            icon: LockIcon,
            dataId: 'changePassword',
        },
        { route: routes.logout, title: t`header.logOut`, icon: ExitToAppIcon, dataId: 'logout' },
    ]

    componentDidMount(): void {
        const { location } = this.props
        const currentUrlParams = new URLSearchParams(location.search)

        this.setState({ query: currentUrlParams.get('query') || '' })
    }

    handleProfileMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) =>
        this.setState({ profileMenuAnchor: event.target })

    handleProfileMenuClose = () => this.setState({ profileMenuAnchor: null })

    handleMobileDrawerToggle = (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return
        }

        this.setState({ mobileDrawerOpen: open })
    }

    handleSearchType = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        this.setState({ query: event.target.value })
    }

    handleSearch = () => {
        const { location, history } = this.props
        const { query } = this.state
        const currentUrlParams = new URLSearchParams(location.search)

        if ((currentUrlParams.get('query') || '') !== query.trim()) {
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
                        <Hidden smDown>
                            <Tooltip title={t`header.signIn`}>
                                <IconButton component={Link} to={routes.login}>
                                    <LockOpenIcon />
                                </IconButton>
                            </Tooltip>

                            <Button
                                variant="outlined"
                                color="primary"
                                component={Link}
                                to={routes.register}
                                data-id="register"
                            >
                                <AccountCircleIcon className="m-r-8" />
                                {t`user.register`}
                            </Button>
                        </Hidden>

                        <Hidden mdUp>
                            <MenuItem component={Link} to={routes.register} className={sStyles.drawerItem}>
                                <AccountCircleIcon className="m-r-32" color="primary" />
                                {t`user.register`}
                            </MenuItem>
                            <MenuItem component={Link} to={routes.login} className={sStyles.drawerItem}>
                                <LockOpenIcon className="m-r-32" />
                                {t`header.signIn`}
                            </MenuItem>
                        </Hidden>
                    </>
                )}

                {this.user && (
                    <>
                        <Hidden smDown>
                            <Tooltip title={t`header.myProfile`}>
                                <IconButton color="primary" onClick={this.handleProfileMenuOpen} data-id="profile-menu">
                                    <UserAvatar user={this.user} size="sm" />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                anchorEl={profileMenuAnchor}
                                keepMounted
                                open={!!profileMenuAnchor}
                                onClose={this.handleProfileMenuClose}
                            >
                                {this.userMenu.map((it) => (
                                    <MenuItem
                                        key={it.route}
                                        onClick={this.handleProfileMenuClose}
                                        component={Link}
                                        to={it.route}
                                        data-id={it.dataId}
                                    >
                                        <it.icon className="m-r-16" />
                                        {it.title}
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Hidden>

                        <Hidden mdUp>
                            {this.userMenu.map((it) => (
                                <MenuItem key={it.route} component={Link} to={it.route} className={sStyles.drawerItem}>
                                    <it.icon className="m-r-32" />
                                    {it.title}
                                </MenuItem>
                            ))}
                        </Hidden>
                    </>
                )}
            </>
        )
    }

    renderMainMenuSection = () => {
        return (
            <>
                <Hidden smDown>
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

                <Hidden mdUp>
                    <MenuItem component={Link} to={routes.user.list} className={sStyles.drawerItem}>
                        <PeopleAltIcon className="m-r-32" />
                        {t`user.listHeader`}
                    </MenuItem>
                    <MenuItem component={Link} to={routes.game.list} className={sStyles.drawerItem}>
                        <SportsEsportsIcon className="m-r-32" />
                        {t`header.gameList`}
                    </MenuItem>
                </Hidden>
            </>
        )
    }

    renderMobileMenuDrawer = () => {
        const { mobileDrawerOpen } = this.state

        return (
            <>
                <IconButton onClick={this.handleMobileDrawerToggle(true)}>
                    <MoreVertIcon />
                </IconButton>
                <Drawer anchor="right" open={mobileDrawerOpen} onClose={this.handleMobileDrawerToggle(false)}>
                    {this.renderUserMenuSection()}
                    <Divider />
                    {this.renderMainMenuSection()}
                    <Divider />
                    <MenuItem onClick={this.handleMobileDrawerToggle(false)} className={sStyles.drawerItem}>
                        <CloseIcon className="m-r-32" />
                        {t`common.close`}
                    </MenuItem>
                    <Divider />
                </Drawer>
            </>
        )
    }

    render() {
        const { sections, classes } = this.props
        const { query } = this.state

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

                        <form action="" style={{ display: 'contents' }} onSubmit={(e) => e.preventDefault()}>
                            <TextField
                                className={sStyles.search}
                                name="query"
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

                        <Hidden smDown>
                            {this.renderMainMenuSection()}
                            {this.renderUserMenuSection()}
                        </Hidden>

                        <Hidden mdUp>{this.renderMobileMenuDrawer()}</Hidden>
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
