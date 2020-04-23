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
import { userService } from '../../../../services/UserService'

interface Props {
    name: string
    removeName?: string
    maxSize: number
    accept: string[]
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
    label?: string
    defaultAvatar?: string | null
}

interface State {
    file: File | null
    remove: boolean
}

class AvatarInput extends React.Component<Props, State> {
    state = {
        file: null as File | null,
        remove: false,
    }

    handleOnDrop = (files: FileWithPath[]) => {
        const { name, setFieldValue } = this.props

        this.setState({ file: files[0] }, () => setFieldValue(name, files[0]))
    }

    handleClear = () => {
        const { name, setFieldValue } = this.props

        this.setState({ file: null }, () => setFieldValue(name, null))
    }

    handleRemoveToggle = () => {
        const { removeName, setFieldValue } = this.props

        if (removeName) {
            this.setState(
                (prevState) => ({ remove: !prevState.remove }),
                () => setFieldValue(removeName, null),
            )
        }
    }

    renderDefaultAvatar = () => {
        const { defaultAvatar, label } = this.props

        if (defaultAvatar) {
            return <Avatar alt={label} src={userService.getAvatarUrl(defaultAvatar)} className={styles.medium} />
        }

        return <Avatar className={styles.medium} />
    }

    render() {
        const { label, maxSize, accept, defaultAvatar, removeName } = this.props
        const { file, remove } = this.state

        return (
            <Dropzone onDropAccepted={this.handleOnDrop} maxSize={maxSize} accept={accept}>
                {({ rejectedFiles, getRootProps, getInputProps }) => (
                    <div>
                        <div {...getRootProps({ className: 'dropzone' })}>
                            <input {...getInputProps({ name: 'file' })} />
                            <InputLabel error={rejectedFiles.length !== 0}>{label}</InputLabel>
                            <Button fullWidth>
                                {file && (
                                    <Avatar alt={file.name} src={URL.createObjectURL(file)} className={styles.medium} />
                                )}
                                {file === null && this.renderDefaultAvatar()}
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
                        {file && (
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
                                            value={removeName}
                                            color="primary"
                                            name={removeName}
                                            onChange={this.handleRemoveToggle}
                                            checked={remove}
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
