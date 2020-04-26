import React, { Component } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles'
import { Form, Formik, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { toast } from 'react-toastify'

import { authService, LoggedInUser } from '../../../services/AuthService'
import { t } from '../../../i18n'
import { routes } from '../../../parameters'
import { userService, UserUpdateRequest } from '../../../services/UserService'
import AvatarInput from '../Profile/AvatarPreview/AvatarInput'

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
    initialValues: LoggedInUser
    classes: {
        paper: string
        avatar: string
        form: string
        submit: string
    }
}

class ProfileEditForm extends Component<Props> {
    validationSchema = Yup.object().shape({
        firstName: Yup.string().required(t`error.validation.required`),
        lastName: Yup.string(),
        removeAvatar: Yup.boolean(),
        avatarFile: Yup.string().nullable(),
    })

    get initialValues(): UserUpdateRequest {
        const { initialValues } = this.props

        return {
            firstName: initialValues.firstName,
            lastName: initialValues.lastName || '',
            avatarFile: {
                file: null,
                delete: false,
            },
        }
    }

    handleSubmit = (values: UserUpdateRequest, actions: FormikHelpers<UserUpdateRequest>) => {
        const { history, initialValues } = this.props

        userService
            .update(initialValues.id, values)
            .then((updatedUser) => {
                toast.info(t('common.successUpdate'))
                authService.update(updatedUser)
                history.push({ pathname: routes.user.profile })
            })
            .catch((error) => {
                toast.error(t(error.message))
                actions.setSubmitting(false)
            })
    }

    render() {
        const { classes, initialValues } = this.props

        return (
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">{t`common.updateInfo`}</Typography>
                <Formik<UserUpdateRequest>
                    initialValues={this.initialValues}
                    validationSchema={this.validationSchema}
                    onSubmit={this.handleSubmit}
                >
                    {({ values, touched, errors, isSubmitting, handleChange, handleBlur, setFieldValue }) => (
                        <Form className={classes.form} noValidate encType="multipart/form-data">
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        name="firstName"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label={t`user.firstName`}
                                        value={values.firstName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.firstName && !!touched.firstName}
                                        helperText={errors.firstName && touched.firstName && errors.firstName}
                                    />
                                </Grid>
                                <Grid item xs={12}>
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
                                    <AvatarInput
                                        setFieldValue={setFieldValue}
                                        name="avatarFile"
                                        defaultAvatar={initialValues.avatar}
                                        label={t`user.avatar`}
                                        maxSize={2500000}
                                        accept={['.jpeg', '.jpg', '.png']}
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
                                {t`common.update`}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(ProfileEditForm))
