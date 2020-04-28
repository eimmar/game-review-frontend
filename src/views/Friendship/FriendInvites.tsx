import * as React from 'react'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import { t } from '../../i18n'
import FriendListContent from '../../components/Friendship/FriendListContent/FriendListContent'
import { authService, LoggedInUser } from '../../services/AuthService'
import { FriendshipStatus } from '../../services/FriendshipService'

export default function FriendInvites() {
    document.title = `${t`pageTitle.friendInvites`} - ${t`common.websiteName`}`

    return (
        <MainLayout>
            <FriendListContent
                infiniteScroll
                title={t`pageTitle.friendInvites`}
                currentUser={authService.getCurrentUser() as LoggedInUser}
                status={FriendshipStatus.Pending}
            />
        </MainLayout>
    )
}
