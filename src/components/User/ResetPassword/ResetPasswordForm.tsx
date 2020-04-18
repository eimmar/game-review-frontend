import React, { Component } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import * as Yup from 'yup'
import { Form, Formik, FormikHelpers } from 'formik'
import { toast } from 'react-toastify'

import { t } from '../../../i18n'
import { authService, ResetPasswordRequest } from '../../../services/AuthService'
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
    token: string
}

class ResetPasswordForm extends Component<Props> {
    validationSchema = Yup.object().shape({
        password: Yup.string()
            .required(t`errors.validation.required`)
            .min(4, t('error.validation.tooShort', { number: 4 })),
        repeatPassword: Yup.string()
            .required(t`errors.validation.required`)
            .oneOf([Yup.ref('password'), null], t`errors.validation.passwordsMustMatch`),
    })

    get initialValues(): ResetPasswordRequest {
        return { password: '', repeatPassword: '' }
    }

    handleSubmit = (values: ResetPasswordRequest, actions: FormikHelpers<ResetPasswordRequest>) => {
        const { history, token } = this.props

        authService
            .resetPassword(token, values)
            .then(() => {
                toast.success(t('user.passwordResetSuccess'))
                history.push({ pathname: routes.login })
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
                <Typography component="h1" variant="h5">{t`user.resetPassword`}</Typography>
                <Formik<ResetPasswordRequest>
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
                                <Grid item xs={12}>
                                    <TextField
                                        variant="outlined"
                                        required
                                        fullWidth
                                        name="repeatPassword"
                                        label={t`user.repeatPassword`}
                                        type="password"
                                        value={values.repeatPassword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.repeatPassword && !!touched.repeatPassword}
                                        helperText={
                                            errors.repeatPassword && touched.repeatPassword && errors.repeatPassword
                                        }
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
                                {t`user.changePassword`}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(ResetPasswordForm))
