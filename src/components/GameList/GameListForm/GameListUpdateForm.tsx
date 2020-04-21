import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import { Form, Formik, FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { toast } from 'react-toastify'
import { FormHelperText, Select, MenuItem } from '@material-ui/core'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import {
    GameList,
    GameListPrivacyType,
    gameListService,
    GameListType,
    GameListUpdateRequest,
} from '../../../services/GameListService'
import { t } from '../../../i18n'

interface Props extends RouteComponentProps {
    initialValues: GameList
    onSuccess: (list: GameList) => void
    onClose: () => void
}

class GameListUpdateForm extends Component<Props> {
    validationSchema = Yup.object().shape({
        privacyType: Yup.string().required(t`errors.validation.required`),
        name: Yup.string().required(t`errors.validation.required`),
    })

    mounted = false

    componentDidMount() {
        this.mounted = true
    }

    componentWillUnmount() {
        this.mounted = false
    }

    get initialValues(): GameListUpdateRequest {
        const { initialValues } = this.props

        return {
            name: initialValues.name,
            privacyType: initialValues.privacyType,
        }
    }

    handleSubmit = (values: GameListUpdateRequest, actions: FormikHelpers<GameListUpdateRequest>) => {
        const { onSuccess, onClose, initialValues } = this.props

        gameListService
            .update(initialValues.id, values)
            .then((list) => {
                onSuccess(list)
                toast.info(t('gameList.successUpdate'))
                onClose()
            })
            .catch((error) => {
                actions.setStatus({ msg: error.message, error: true })
                toast.error(t(error.message))
            })
            .finally(() => this.mounted && actions.setSubmitting(false))
    }

    render() {
        const { onClose, initialValues } = this.props

        return (
            <Formik<GameListUpdateRequest>
                initialValues={this.initialValues}
                validationSchema={this.validationSchema}
                onSubmit={this.handleSubmit}
            >
                {({ values, touched, errors, isSubmitting, handleChange, handleBlur }) => (
                    <Form className="width-full" noValidate>
                        <Grid container spacing={2}>
                            {initialValues.type === GameListType.Custom && (
                                <Grid item xs={12}>
                                    <TextField
                                        name="name"
                                        variant="outlined"
                                        required
                                        fullWidth
                                        label={t`gameList.name`}
                                        value={values.name || ''}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={!!errors.name && !!touched.name}
                                        helperText={errors.name && touched.name && errors.name}
                                    />
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <Select
                                    name="privacyType"
                                    required
                                    fullWidth
                                    label={t`gameList.privacyType`}
                                    value={values.privacyType}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    error={!!errors.privacyType && !!touched.privacyType}
                                >
                                    <MenuItem value={GameListPrivacyType.Public}>{t`gameList.public`}</MenuItem>
                                    <MenuItem
                                        value={GameListPrivacyType.FriendsOnly}
                                    >{t`gameList.friendsOnly`}</MenuItem>
                                    <MenuItem value={GameListPrivacyType.Private}>{t`gameList.private`}</MenuItem>
                                </Select>
                                <FormHelperText
                                    variant="outlined"
                                    required
                                    error={!!errors.privacyType && !!touched.privacyType}
                                >
                                    {errors.privacyType && touched.privacyType && errors.privacyType}
                                </FormHelperText>
                            </Grid>

                            <Grid item xs={12}>
                                <Button type="submit" variant="contained" color="primary" disabled={isSubmitting}>
                                    {t`common.submit`}
                                </Button>
                                <Button onClick={onClose} color="primary" variant="outlined" style={{ float: 'right' }}>
                                    {t`common.cancel`}
                                </Button>
                            </Grid>
                        </Grid>
                    </Form>
                )}
            </Formik>
        )
    }
}

export default withRouter(GameListUpdateForm)
