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

        event.target !== null && this.setState({ filters: { ...filters, query: event.target.value as string } })
    }

    handleSearchSubmit = () => {
        const { location, history } = this.props
        const { filters } = this.state
        const currentUrlParams = new URLSearchParams(location.search)

        currentUrlParams.set('query', filters.query || '')
        currentUrlParams.set('page', '1')
        history.push(`${location.pathname}?${currentUrlParams.toString()}`)
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
                            <Grid item sm={12} className={sStyles.searchContainer}>
                                <TextField
                                    className={sStyles.search}
                                    name="userQuery"
                                    label={t`common.search`}
                                    value={(filters.query || '').replace(/\+/g, ' ')}
                                    onChange={this.handleQueryChange}
                                />
                                <Button
                                    style={{ verticalAlign: 'bottom' }}
                                    variant="contained"
                                    color="primary"
                                    onClick={this.handleSearchSubmit}
                                >{t`common.search`}</Button>
                            </Grid>
                        </Grid>
                    </Container>
                </div>
            </>
        )
    }
}

export default withRouter(withStyles(styles)(UsersFilter))
