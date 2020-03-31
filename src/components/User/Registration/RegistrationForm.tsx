import React, { Component } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles'
import { Form, Formik, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { withRouter, RouteComponentProps, Link as RouterLink } from 'react-router-dom'
import { toast } from 'react-toastify'

import { authService, RegistrationRequest } from '../../../services/AuthService'
import { t } from '../../../i18n'
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
            marginTop: spacing(3),
        },
        submit: {
            margin: spacing(3, 0, 2),
        },
    })

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    classes: {
        paper: string
        avatar: string
        form: string
        submit: string
    }
}

class RegistrationForm extends Component<Props> {
    validationSchema = Yup.object().shape({
        firstName: Yup.string().required(t`errors.validation.required`),
        lastName: Yup.string().required(t`errors.validation.required`),
        password: Yup.string().required(t`errors.validation.required`),
        email: Yup.string()
            .required(t`errors.validation.required`)
            .email(t`errors.validation.email`),
    })

    get initialValues(): RegistrationRequest {
        return {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        }
    }

    handleSubmit = (values: RegistrationRequest, actions: FormikHelpers<RegistrationRequest>) => {
        const { history } = this.props

        authService
            .register(values)
            .then(() => {
                toast.success(t('user.successCreate'))
                history.push({ pathname: routes.homePage })
            })
            .catch((error) => {
                actions.setStatus({ msg: error.message, error: true })
                toast.error(t(error.message))
            })
            .finally(() => actions.setSubmitting(false))
    }

    render() {
        const { classes } = this.props

        return (
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">{t`user.register`}</Typography>
                <Formik<RegistrationRequest>
                    initialValues={this.initialValues}
                    validationSchema={this.validationSchema}
                    onSubmit={this.handleSubmit}
                    render={({ values, touched, errors, isSubmitting, handleChange, handleBlur }) => (
                        <Form className={classes.form} noValidate>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        name="firstName"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label={t`user.firstName`}
                                        autoFocus
                                        value={values.firstName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.firstName && !!touched.firstName}
                                        helperText={errors.firstName && touched.firstName && errors.firstName}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label={t`user.lastName`}
                                        name="lastName"
                                        value={values.lastName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.lastName && !!touched.lastName}
                                        helperText={errors.lastName && touched.lastName && errors.lastName}
                                    />
                                </Grid>
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
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                disabled={isSubmitting}
                            >
                                {t`user.register`}
                            </Button>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <Link variant="body2">
                                        <RouterLink to={routes.login}>{t`user.alreadyHaveAccount`}</RouterLink>
                                    </Link>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                />
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(RegistrationForm))