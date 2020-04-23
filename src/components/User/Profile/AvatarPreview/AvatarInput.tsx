import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Dropzone, { FileWithPath } from 'react-dropzone'
import { FormHelperText, InputLabel, Grid } from '@material-ui/core'
import Button from '@material-ui/core/Button'
import RemoveIcon from '@material-ui/icons/Remove'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Checkbox from '@material-ui/core/Checkbox'

import { t } from '../../../../i18n'
import styles from './AvatarInput.module.scss'
import { UserAvatarFile, userService } from '../../../../services/UserService'

interface Props {
    name: string
    maxSize: number
    accept: string[]
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
    label?: string
    defaultAvatar?: string | null
}

interface State {
    image: UserAvatarFile
}

class AvatarInput extends React.Component<Props, State> {
    state = {
        image: {
            file: null as File | null,
            delete: false,
        },
    }

    handleOnDrop = (files: FileWithPath[]) => {
        const { name, setFieldValue } = this.props
        const { image } = this.state
        const newImage = { ...image, file: files[0] }

        this.setState({ image: newImage }, () => setFieldValue(name, newImage))
    }

    handleClear = () => {
        const { name, setFieldValue } = this.props
        const { image } = this.state
        const newImage = { ...image, file: null }

        this.setState({ image: newImage }, () => setFieldValue(name, newImage))
    }

    handleRemoveToggle = () => {
        const { name, setFieldValue } = this.props
        const { image } = this.state
        const newImage = { ...image, delete: !image.delete }

        this.setState({ image: newImage }, () => setFieldValue(name, newImage))
    }

    renderDefaultAvatar = () => {
        const { defaultAvatar, label } = this.props

        if (defaultAvatar) {
            return <Avatar alt={label} src={userService.getAvatarUrl(defaultAvatar)} className={styles.medium} />
        }

        return <Avatar className={styles.medium} />
    }

    render() {
        const { label, maxSize, accept, defaultAvatar } = this.props
        const { image } = this.state

        return (
            <Dropzone onDropAccepted={this.handleOnDrop} maxSize={maxSize} accept={accept}>
                {({ rejectedFiles, getRootProps, getInputProps }) => (
                    <div>
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps({ name: 'file' })} />
                            <InputLabel error={rejectedFiles.length !== 0}>{label}</InputLabel>
                            <Button fullWidth>
                                {image.file && (
                                    <Avatar
                                        alt={image.file.name}
                                        src={URL.createObjectURL(image.file)}
                                        className={styles.medium}
                                    />
                                )}
                                {image.file === null && this.renderDefaultAvatar()}
                            </Button>
                        </div>
                        {rejectedFiles.length > 0 && (
                            <FormHelperText error>
                                {t('error.validation.invalidFile', {
                                    sizeMb: 2500000 / 1000000,
                                    types: 'jpeg, jpg, png',
                                })}
                            </FormHelperText>
                        )}
                        {image.file && (
                            <Button
                                className={styles.remove}
                                onClick={this.handleClear}
                                variant="outlined"
                                startIcon={<RemoveIcon />}
                            >
                                {t`common.delete`}
                            </Button>
                        )}
                        {defaultAvatar && (
                            <Grid>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            color="primary"
                                            name="delete"
                                            onChange={this.handleRemoveToggle}
                                            checked={image.delete}
                                        />
                                    }
                                    label={t`user.removeAvatar`}
                                />
                            </Grid>
                        )}
                    </div>
                )}
            </Dropzone>
        )
    }
}

export default AvatarInput
