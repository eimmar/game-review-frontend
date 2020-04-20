import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Container, TextField, Button, Typography, CssBaseline } from '@material-ui/core'

import { t } from '../../../i18n'
import { requestService } from '../../../services/RequestService'
import { UserFilterRequest } from '../../../services/UserService'
import sStyles from './UsersFilter.module.scss'

const styles = ({ spacing, palette }: Theme) =>
    createStyles({
        heroContent: {
            backgroundColor: palette.background.paper,
            padding: spacing(8, 0, 6),
        },
    })

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    classes: {
        heroContent: string
    }
}

interface State {
    filters: UserFilterRequest
}

class UsersFilter extends Component<Props, State> {
    constructor(props: Props) {
        super(props)

        this.state = {
            filters: requestService.getFilters(props.location.search) as UserFilterRequest,
        }
    }

    handleQueryChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>) => {
        const { filters } = this.state

        event.target !== null && this.setState({ filters: { ...filters, user: event.target.value as string } })
    }

    handleSearchSubmit = () => {
        const { location, history } = this.props
        const { filters } = this.state
        const userFilter = filters.user?.trim() || ''
        const currentUrlParams = new URLSearchParams(location.search)

        if ((currentUrlParams.get('user') || '') !== userFilter) {
            currentUrlParams.set('user', userFilter)
            currentUrlParams.set('page', '1')
            history.push(`${location.pathname}?${currentUrlParams.toString()}`)
        }
    }

    render() {
        const { classes } = this.props
        const { filters } = this.state

        return (
            <>
                <CssBaseline />
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        <Typography component="h1" variant="h4" align="center" color="textPrimary" gutterBottom>
                            {t`user.listHeader`}
                        </Typography>
                    </Container>
                    <Container>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4} md={8} />
                            <Grid item xs={12} sm={8} md={4}>
                                <form action="" onSubmit={(e) => e.preventDefault()}>
                                    <Grid container>
                                        <Grid item xs={9}>
                                            <TextField
                                                fullWidth
                                                name="userQuery"
                                                label={t`common.search`}
                                                value={(filters.user || '').replace(/\+/g, ' ')}
                                                onChange={this.handleQueryChange}
                                            />
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Button
                                                className={sStyles.searchBtn}
                                                type="submit"
                                                style={{ verticalAlign: 'bottom' }}
                                                variant="contained"
                                                color="primary"
                                                onClick={this.handleSearchSubmit}
                                            >{t`common.search`}</Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Grid>
                        </Grid>
                    </Container>
                </div>
            </>
        )
    }
}

export default withRouter(withStyles(styles)(UsersFilter))
