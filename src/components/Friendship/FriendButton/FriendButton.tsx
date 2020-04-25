import React from 'react'
import PersonAddIcon from '@material-ui/icons/PersonAdd'
import PersonAddDisabledIcon from '@material-ui/icons/PersonAddDisabled'
import PersonIcon from '@material-ui/icons/Person'
import { Button, CircularProgress, DialogActions, IconButton, Tooltip, Typography } from '@material-ui/core'
import Dialog from '@material-ui/core/Dialog'
import DialogTitle from '@material-ui/core/DialogTitle'
import { toast } from 'react-toastify'

import { Friendship, friendshipService, FriendshipStatus } from '../../../services/FriendshipService'
import { User, WithUser } from '../../../services/UserService'
import { authService } from '../../../services/AuthService'
import { t } from '../../../i18n'

interface Props {
    user: User
    initialFriendship?: Friendship<WithUser>
    onAcceptSuccess?: () => void
    onRemoveSuccess?: () => void
}

interface State {
    friendship: Friendship | null
    removeModal: boolean
    loading: boolean
}

class FriendButton extends React.Component<Props, State> {
    currentUser = authService.getCurrentUser()

    constructor(props: Props) {
        super(props)
        this.state = {
            loading: true,
            friendship: props.initialFriendship || null,
            removeModal: false,
        }
    }

    componentDidMount(): void {
        const { user, initialFriendship } = this.props

        if (!initialFriendship && this.currentUser && user.id !== this.currentUser.id) {
            friendshipService.get(user.id).then((friendship) => this.setState({ friendship, loading: false }))
        } else {
            this.setState({ loading: false })
        }
    }

    get removeModal() {
        const { removeModal } = this.state

        return (
            <Dialog open={removeModal} onClose={this.handleRemoveModalToggle} scroll="body">
                <DialogTitle>
                    <Typography variant="h6" component="p">{t`friendship.confirmRemove`}</Typography>
                </DialogTitle>
                <DialogActions>
                    <Button type="submit" variant="contained" color="secondary" onClick={this.handleRemoveRequest}>
                        {t`friendship.remove`}
                    </Button>
                    <Button onClick={this.handleRemoveModalToggle} color="primary" variant="outlined">
                        {t`common.cancel`}
                    </Button>
                </DialogActions>
            </Dialog>
        )
    }

    get button() {
        const { friendship, loading } = this.state
        const { user } = this.props

        if (!this.currentUser || user.id === this.currentUser.id) {
            return ''
        }

        if (loading) {
            return <CircularProgress />
        }

        if (!friendship) {
            return (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleSendRequest}
                    startIcon={<PersonAddIcon />}
                >{t`friendship.addFriend`}</Button>
            )
        }

        if (friendship.status === FriendshipStatus.Accepted) {
            return (
                <>
                    <Button variant="contained" startIcon={<PersonIcon />}>{t`friendship.youAreFriends`}</Button>
                    <Tooltip placement="top" title={t`friendship.removeFriend`}>
                        <IconButton color="secondary" onClick={this.handleRemoveModalToggle}>
                            <PersonAddDisabledIcon />
                        </IconButton>
                    </Tooltip>
                </>
            )
        }

        if (friendship.receiver && friendship.receiver.id === this.currentUser.id) {
            return (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleAcceptRequest}
                    startIcon={<PersonAddIcon />}
                >{t`friendship.accept`}</Button>
            )
        }

        return <Button variant="contained" disabled startIcon={<PersonIcon />}>{t`friendship.pending`}</Button>
    }

    handleSendRequest = () => {
        const { user } = this.props

        this.setState({ loading: true })

        friendshipService
            .add(user.id)
            .then((friendship) => this.setState({ friendship }))
            .catch((error) => toast.error(error.message))
            .finally(() => this.setState({ loading: false }))
    }

    handleAcceptRequest = () => {
        const { user, onAcceptSuccess } = this.props

        this.setState({ loading: true })

        friendshipService
            .accept(user.id)
            .then((friendship) => this.setState({ friendship }, () => onAcceptSuccess && onAcceptSuccess()))
            .catch((error) => toast.error(error.message))
            .finally(() => this.setState({ loading: false }))
    }

    handleRemoveRequest = () => {
        const { user, onRemoveSuccess } = this.props

        this.setState({ loading: true })

        friendshipService
            .remove(user.id)
            .then(() => {
                this.setState({ friendship: null }, () => {
                    toast.info(t`friendship.removeSuccess`)
                    onRemoveSuccess && onRemoveSuccess()
                    this.handleRemoveModalToggle()
                })
            })
            .catch((error) => toast.error(error.message))
            .finally(() => this.setState({ loading: false }))
    }

    handleRemoveModalToggle = () => this.setState((prevState) => ({ removeModal: !prevState.removeModal }))

    render(): React.ReactNode {
        return (
            <>
                {this.button}
                {this.removeModal}
            </>
        )
    }
}

export default FriendButton
