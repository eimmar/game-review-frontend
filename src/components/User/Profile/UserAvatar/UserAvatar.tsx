import React from 'react'
import { Avatar, Typography } from '@material-ui/core'

import { LoggedInUser } from '../../../../services/AuthService'
import styles from './UserAvatar.module.scss'
import { User, userService } from '../../../../services/UserService'
import { flattenClasses } from '../../../../services/Util/StyleUtils'

interface Props {
    user: User | LoggedInUser
    size?: 'sm' | 'lg'
}

function UserAvatar(props: Props) {
    const { user, size } = props
    const classes = flattenClasses([styles.avatar, size === 'sm' && styles.sm])

    if (user.avatar) {
        return <Avatar className={classes} src={userService.getAvatarUrl(user.avatar)} />
    }

    return (
        <Avatar className={styles.avatar}>
            <Typography variant="h3">{userService.getInitials(user)}</Typography>
        </Avatar>
    )
}

export default UserAvatar
