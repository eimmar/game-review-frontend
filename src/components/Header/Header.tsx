import * as React from 'react'
import { Button, IconButton, Link as UiLink, Toolbar } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import SearchIcon from '@material-ui/icons/Search'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter, Link } from 'react-router-dom'

import { ContentLayout } from '../../layouts/ContentLayout/ContentLayout'
import sStyles from './Header.module.scss'
import { t } from '../../i18n'
import { routes } from '../../parameters'
import { authService } from '../../services/AuthService'

const styles = ({ palette, spacing }: Theme) =>
    createStyles({
        toolbar: {
            borderBottom: `1px solid ${palette.divider}`,
        },
        toolbarTitle: {
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
    title?: string
    classes: {
        toolbar: string
        toolbarTitle: string
        toolbarSecondary: string
        toolbarLink: string
    }
}

class Header extends React.PureComponent<Props> {
    user = authService.getCurrentUser()

    render() {
        const { sections, title, classes } = this.props

        return (
            <header className={sStyles.header}>
                <ContentLayout>
                    <Toolbar className={classes.toolbar}>
                        <Button size="small">Subscribe</Button>
                        <Typography
                            component="h2"
                            variant="h5"
                            color="inherit"
                            align="center"
                            noWrap
                            className={classes.toolbarTitle}
                        >
                            {title}
                        </Typography>
                        <IconButton>
                            <SearchIcon />
                        </IconButton>
                        {!this.user && (
                            <Button variant="text" component={Link} to={routes.login}>
                                {t`header.signIn`}
                            </Button>
                        )}

                        {this.user && (
                            <Button variant="text" component={Link} to={routes.logout}>
                                {t`header.logOut`}
                            </Button>
                        )}
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
