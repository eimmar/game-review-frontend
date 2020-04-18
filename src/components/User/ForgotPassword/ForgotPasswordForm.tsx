import React, { Component } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Link from '@material-ui/core/Link'
import Grid from '@material-ui/core/Grid'
import VpnKeyIcon from '@material-ui/icons/VpnKey'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter, Link as RouterLink } from 'react-router-dom'
import * as Yup from 'yup'
import { Form, Formik, FormikHelpers } from 'formik'
import { toast } from 'react-toastify'

import { t } from '../../../i18n'
import { authService, ForgotPasswordRequest } from '../../../services/AuthService'
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
            backgroundColor: palette.info.main,
        },
        form: {
            width: '100%', // Fix IE 11 issue.
            marginTop: spacing(1),
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

class ForgotPasswordForm extends Component<Props> {
    validationSchema = Yup.object().shape({
        email: Yup.string()
            .required(t`errors.validation.required`)
            .email(t`errors.validation.email`),
    })

    get initialValues(): ForgotPasswordRequest {
        return { email: '' }
    }

    handleSubmit = (values: ForgotPasswordRequest, actions: FormikHelpers<ForgotPasswordRequest>) => {
        const { history } = this.props

        authService
            .forgotPassword(values)
            .then(() => {
                toast.success(t('user.passwordResetLinkSent'))
                history.push({ pathname: routes.homePage })
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
                    <VpnKeyIcon />
                </Avatar>
                <Typography component="h1" variant="h5">{t`user.resetPassword`}</Typography>
                <Formik<ForgotPasswordRequest>
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
                            </Grid>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                disabled={isSubmitting}
                            >
                                {t`user.sendResetPasswordRequest`}
                            </Button>

                            <Grid container>
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

export default withRouter(withStyles(styles)(ForgotPasswordForm))
