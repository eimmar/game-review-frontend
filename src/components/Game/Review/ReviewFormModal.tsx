import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles'
import { Form, Formik, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import Rating from '@material-ui/lab/Rating'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import { DialogActions, FormHelperText, InputLabel } from '@material-ui/core'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import { GameReviewRequest, reviewService } from '../../../services/GameReviewService'
import { t } from '../../../i18n'
import { authService } from '../../../services/AuthService'
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
        },
        ratingLabel: {
            marginBottom: 24,
        },
        submit: {
            margin: spacing(3, 0, 2),
        },
    })

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    gameId: string
    classes: {
        paper: string
        avatar: string
        form: string
        submit: string
        ratingLabel: string
    }
}

interface State {
    open: boolean
}

class ReviewFormModal extends Component<Props, State> {
    validationSchema = Yup.object().shape({
        game: Yup.string().required(t`errors.validation.required`),
        user: Yup.string().required(t`errors.validation.required`),
        comment: Yup.string()
            .required(t`errors.validation.required`)
            .max(10000, t('error.validation.tooLong', { number: 10000 })),
        title: Yup.string()
            .required(t`errors.validation.required`)
            .max(255, t('error.validation.tooLong', { number: 255 })),
        rating: Yup.number()
            .required(t`errors.validation.required`)
            .min(1, t`errors.validation.required`)
            .max(10),
        pros: Yup.string()
            .nullable()
            .max(1000, t('error.validation.tooLong', { number: 1000 })),
        cons: Yup.string()
            .nullable()
            .max(1000, t('error.validation.tooLong', { number: 1000 })),
    })

    state = {
        open: false,
    }

    get initialValues(): GameReviewRequest {
        const { gameId } = this.props
        const user = authService.getCurrentUser()

        return {
            game: gameId,
            user: user ? user.id : '',
            title: '',
            comment: '',
            rating: 0,
            pros: null,
            cons: null,
        }
    }

    handleSubmit = (values: GameReviewRequest, actions: FormikHelpers<GameReviewRequest>) => {
        reviewService
            .create(values)
            .then(() => {
                this.handleModalToggle()
                toast.success(t('gameReview.successCreate'))
            })
            .catch((error) => {
                actions.setStatus({ msg: error.message, error: true })
                toast.error(t(error.message))
            })
            .finally(() => actions.setSubmitting(false))
    }

    handleButtonClick = () => {
        if (!authService.getCurrentUser()) {
            const { history, location } = this.props

            history.push(routes.login, { referer: { url: location.pathname } })
        } else {
            this.handleModalToggle()
        }
    }

    handleModalToggle = () => this.setState((prevState) => ({ open: !prevState.open }))

    render() {
        const { classes } = this.props
        const { open } = this.state

        return (
            <>
                <Button variant="outlined" color="primary" onClick={this.handleButtonClick}>
                    {t`gameReview.create`}
                </Button>
                <div className={classes.paper}>
                    <Dialog
                        open={open}
                        onClose={this.handleModalToggle}
                        aria-labelledby="form-dialog-title"
                        scroll="body"
                    >
                        <DialogTitle>
                            <Typography variant="h5">{t`gameReview.create`}</Typography>
                        </DialogTitle>
                        <Formik<GameReviewRequest>
                            initialValues={this.initialValues}
                            validationSchema={this.validationSchema}
                            onSubmit={this.handleSubmit}
                            render={({ values, touched, errors, isSubmitting, handleChange, handleBlur }) => (
                                <Form className={classes.form} noValidate>
                                    <DialogContent>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <TextField
                                                    multiline
                                                    name="title"
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    label={t`gameReview.title`}
                                                    autoFocus
                                                    value={values.title || ''}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={!!errors.title && !!touched.title}
                                                    helperText={errors.title && touched.title && errors.title}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <InputLabel
                                                    className={classes.ratingLabel}
                                                    variant="outlined"
                                                    required
                                                    error={!!errors.rating && !!touched.rating}
                                                >{t`gameReview.rating`}</InputLabel>
                                                <Rating
                                                    name="rating"
                                                    value={values.rating}
                                                    max={10}
                                                    onChange={(event) => handleChange(event)}
                                                />
                                                <FormHelperText
                                                    variant="outlined"
                                                    required
                                                    error={!!errors.rating && !!touched.rating}
                                                >
                                                    {errors.rating && touched.rating && errors.rating}
                                                </FormHelperText>
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField
                                                    multiline
                                                    name="comment"
                                                    variant="outlined"
                                                    required
                                                    fullWidth
                                                    label={t`gameReview.comment`}
                                                    autoFocus
                                                    value={values.comment || ''}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={!!errors.comment && !!touched.comment}
                                                    helperText={errors.comment && touched.comment && errors.comment}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField
                                                    multiline
                                                    name="pros"
                                                    variant="outlined"
                                                    fullWidth
                                                    label={t`gameReview.pros`}
                                                    autoFocus
                                                    value={values.pros || ''}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={!!errors.pros && !!touched.pros}
                                                    helperText={errors.pros && touched.pros && errors.pros}
                                                />
                                            </Grid>

                                            <Grid item xs={12}>
                                                <TextField
                                                    multiline
                                                    name="cons"
                                                    variant="outlined"
                                                    fullWidth
                                                    label={t`gameReview.cons`}
                                                    autoFocus
                                                    value={values.cons || ''}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    error={!!errors.cons && !!touched.cons}
                                                    helperText={errors.cons && touched.cons && errors.cons}
                                                />
                                            </Grid>
                                        </Grid>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={this.handleModalToggle} color="primary" variant="outlined">
                                            {t`common.close`}
                                        </Button>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            disabled={isSubmitting}
                                        >
                                            {t`common.submit`}
                                        </Button>
                                    </DialogActions>
                                </Form>
                            )}
                        />
                    </Dialog>
                </div>
            </>
        )
    }
}

export default withRouter(withStyles(styles)(ReviewFormModal))
