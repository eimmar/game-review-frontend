import React, { Component } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter, Link as RouterLink } from 'react-router-dom'
import * as Yup from 'yup'
import { Form, Formik, FormikHelpers } from 'formik'
import { toast } from 'react-toastify'

import { t } from '../../../i18n'
import { authService, LogInRequest } from '../../../services/AuthService'
import { routes } from '../../../parameters'

const styles = ({ palette, spacing }: Theme) =>
    createStyles({
        paper: {
            marginTop: spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
        },
        avatar: {
            margin: spacing(1),
            backgroundColor: palette.secondary.main,
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: spacing(1),
        },
        submit: {
            margin: spacing(3, 0, 2),
        },
    })

interface Props extends WithStyles<typeof styles>, RouteComponentProps<{}, {}, { referer: Referer<any> | null }> {
    classes: {
        paper: string
        avatar: string
        form: string
        submit: string
    }
}

class LoginForm extends Component<Props> {
    validationSchema = Yup.object().shape({
        password: Yup.string().required(t`errors.validation.required`),
        email: Yup.string()
            .required(t`errors.validation.required`)
            .email(t`errors.validation.email`),
    })

    get initialValues(): LogInRequest {
        return {
            email: '',
            password: '',
            rememberMe: false,
        }
    }

    handleSubmit = (values: LogInRequest, actions: FormikHelpers<LogInRequest>) => {
        const { history, location } = this.props

        authService
            .login(values)
            .then(() => {
                location.state && location.state.referer
                    ? history.push({ pathname: location.state.referer.url, state: location.state.referer.state })
                    : history.push({ pathname: routes.homePage })
            })
            .catch((error) => {
                toast.error(t(error.message))
                actions.setSubmitting(false)
            })
    }

    render() {
        const { classes } = this.props

        return (
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">{t`user.signIn`}</Typography>
                <Formik<LogInRequest>
                    initialValues={this.initialValues}
                    validationSchema={this.validationSchema}
                    onSubmit={this.handleSubmit}
                >
                    {({ values, touched, errors, isSubmitting, handleChange, handleBlur }) => (
                        <Form className={classes.form} noValidate>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label={t`user.email`}
                                        name="email"
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.email && !!touched.email}
                                        helperText={errors.email && touched.email && errors.email}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="password"
                                        label={t`user.password`}
                                        type="password"
                                        value={values.password}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.password && !!touched.password}
                                        helperText={errors.password && touched.password && errors.password}
                                    />
                                </Grid>
                            </Grid>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        value="remember"
                                        color="primary"
                                        name="rememberMe"
                                        onChange={handleChange}
                                        checked={values.rememberMe}
                                    />
                                }
                                label={t`user.rememberMe`}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                disabled={isSubmitting}
                            >
                                {t`user.signIn`}
                            </Button>

                            <Grid container>
                                <Grid item xs>
                                    <Link variant="body2" component={RouterLink} to={routes.forgotPassword}>
                                        {t`user.forgotPassword`}
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link variant="body2" component={RouterLink} to={routes.register}>
                                        {t`user.registerIfNoAccount`}
                                    </Link>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(LoginForm))
