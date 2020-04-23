import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, WithStyles, withStyles } from '@material-ui/core/styles'
import { FieldArray, Form, Formik, FormikErrors, FormikHelpers, FormikTouched } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import Rating from '@material-ui/lab/Rating'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import { DialogActions, FormHelperText, IconButton, InputLabel, Tooltip } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import RemoveIcon from '@material-ui/icons/Remove'
import ThumbUpIcon from '@material-ui/icons/ThumbUp'
import ThumbDownIcon from '@material-ui/icons/ThumbDown'

import { GameReview, GameReviewRequest, ProsCons, reviewService } from '../../services/GameReviewService'
import { t } from '../../i18n'
import { authenticatedAction, authService } from '../../services/AuthService'

const styles = ({ spacing }: Theme) =>
    createStyles({
        paper: {
            marginTop: spacing(8),
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
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

interface Props extends WithStyles<typeof styles> {
    gameId: string
    initialValues?: GameReview
    button?: (onClick: () => void) => React.ReactNode
    onSuccess?: (review: GameReview) => void
    classes: {
        paper: string
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
        pros: Yup.array()
            .of(
                Yup.string()
                    .nullable()
                    .max(99, t('error.validation.tooLong', { number: 99 })),
            )
            .max(10, t('error.validation.tooMany', { number: 10 })),
        cons: Yup.array()
            .of(
                Yup.string()
                    .nullable()
                    .max(99, t('error.validation.tooLong', { number: 99 })),
            )
            .max(10, t('error.validation.tooMany', { number: 10 })),
    })

    state = {
        open: false,
    }

    handleModalToggle = authenticatedAction(() => this.setState((prevState) => ({ open: !prevState.open })))

    get initialValues(): GameReviewRequest {
        const { gameId, initialValues } = this.props
        const user = authService.getCurrentUser()

        if (initialValues) {
            return reviewService.toFormData(initialValues)
        }

        return {
            game: gameId,
            user: user ? user.id : '',
            title: '',
            comment: '',
            rating: 0,
            pros: [],
            cons: [],
        }
    }

    get button() {
        const { button } = this.props

        if (button) {
            return button(this.handleModalToggle)
        }

        return (
            <Button variant="outlined" color="primary" onClick={this.handleModalToggle}>
                {t`gameReview.create`}
            </Button>
        )
    }

    handleSubmit = (values: GameReviewRequest, actions: FormikHelpers<GameReviewRequest>) => {
        const { initialValues, onSuccess } = this.props
        const promise = initialValues ? reviewService.update(initialValues.id, values) : reviewService.create(values)

        promise
            .then((review) => {
                onSuccess && onSuccess(review)
                this.handleModalToggle()
                initialValues ? toast.info(t('gameReview.successUpdate')) : toast.info(t('gameReview.successCreate'))
            })
            .catch((error) => {
                actions.setStatus({ msg: error.message, error: true })
                toast.error(t(error.message))
            })
            .finally(() => actions.setSubmitting(false))
    }

    renderFieldArray(
        name: ProsCons,
        values: GameReviewRequest,
        touched: FormikTouched<GameReviewRequest>,
        errors: FormikErrors<GameReviewRequest>,
        handleChange: (e: React.ChangeEvent<any>) => void,
        handleBlur: (e: any) => void,
        header: React.ReactNode,
        inputLabel: string,
    ) {
        return (
            <FieldArray name={name}>
                {(arrayHelpers) => {
                    return (
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">{header}</Typography>
                            {values[name].map((it, index) => {
                                const error =
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                                    // @ts-ignore
                                    !!errors[name] && !!errors[name][index] && touched[name] && !!touched[name][index]
                                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                                // @ts-ignore
                                const helperText = errors[name] && touched[name] && errors[name][index]

                                return (
                                    <Grid container key={index}>
                                        <Grid item xs={11}>
                                            <TextField
                                                name={`${name}.${index}`}
                                                size="small"
                                                variant="outlined"
                                                fullWidth
                                                label={inputLabel}
                                                value={values[name][index] || ''}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={error}
                                                helperText={helperText}
                                            />
                                        </Grid>
                                        <Grid item xs={1}>
                                            <Tooltip title={t`common.remove`}>
                                                <IconButton onClick={() => arrayHelpers.remove(index)}>
                                                    <RemoveIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </Grid>
                                    </Grid>
                                )
                            })}
                            {values.pros.length < 10 && (
                                <Tooltip title={t`common.add`}>
                                    <IconButton onClick={() => arrayHelpers.push('')}>
                                        <AddIcon />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </Grid>
                    )
                }}
            </FieldArray>
        )
    }

    render() {
        const { classes } = this.props
        const { open } = this.state

        return (
            <>
                {this.button}
                <Dialog open={open} onClose={this.handleModalToggle} scroll="body">
                    <DialogTitle>
                        <Typography variant="h5">{t`gameReview.create`}</Typography>
                    </DialogTitle>
                    <Formik<GameReviewRequest>
                        initialValues={this.initialValues}
                        validationSchema={this.validationSchema}
                        onSubmit={this.handleSubmit}
                    >
                        {({ values, touched, errors, isSubmitting, handleChange, handleBlur }) => (
                            <Form className={classes.form} noValidate>
                                <DialogContent>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <TextField
                                                multiline
                                                name="title"
                                                variant="outlined"
                                                size="small"
                                                required
                                                fullWidth
                                                label={t`gameReview.title`}
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
                                                size="small"
                                                required
                                                fullWidth
                                                label={t`gameReview.comment`}
                                                value={values.comment || ''}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={!!errors.comment && !!touched.comment}
                                                helperText={errors.comment && touched.comment && errors.comment}
                                            />
                                        </Grid>

                                        {this.renderFieldArray(
                                            'pros',
                                            values,
                                            touched,
                                            errors,
                                            handleChange,
                                            handleBlur,
                                            <>
                                                {t`gameReview.pros`}
                                                <ThumbUpIcon className="m-l-8 m-t-16" />
                                            </>,
                                            t`gameReview.pro`,
                                        )}

                                        {this.renderFieldArray(
                                            'cons',
                                            values,
                                            touched,
                                            errors,
                                            handleChange,
                                            handleBlur,
                                            <>
                                                {t`gameReview.cons`}
                                                <ThumbDownIcon className="m-l-8 m-t-16" />
                                            </>,
                                            t`gameReview.con`,
                                        )}
                                    </Grid>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={this.handleModalToggle} color="primary" variant="outlined">
                                        {t`common.close`}
                                    </Button>
                                    <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                                        {t`common.submit`}
                                    </Button>
                                </DialogActions>
                            </Form>
                        )}
                    </Formik>
                </Dialog>
            </>
        )
    }
}

export default withStyles(styles)(ReviewFormModal)
