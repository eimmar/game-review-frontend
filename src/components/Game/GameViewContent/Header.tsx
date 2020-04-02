import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Link, Toolbar, Button, IconButton } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'

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
    sections: Section[]
    title: string
    classes: {
        toolbar: string
        toolbarTitle: string
        toolbarSecondary: string
        toolbarLink: string
    }
}

// eslint-disable-next-line react/prefer-stateless-function
class Header extends Component<Props> {
    render() {
        const { sections, title, classes } = this.props

        return (
            <>
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
                    <Button variant="outlined" size="small">
                        Sign up
                    </Button>
                </Toolbar>
                <Toolbar component="nav" variant="dense" className={classes.toolbarSecondary}>
                    {sections.map((section) => (
                        <Link
                            color="inherit"
                            noWrap
                            key={section.title}
                            variant="body2"
                            href={section.url}
                            className={classes.toolbarLink}
                        >
                            {section.title}
                        </Link>
                    ))}
                </Toolbar>
            </>
        )
    }
}

export default withRouter(withStyles(styles)(Header))
