import * as React from 'react'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import { t } from '../../i18n'
import FriendListContent from '../../components/Friendship/FriendListContent/FriendListContent'
import { authService, LoggedInUser } from '../../services/AuthService'
import { FriendshipStatus } from '../../services/FriendshipService'

export default function FriendListView() {
    document.title = `${t`pageTitle.friends`} - ${t`common.websiteName`}`

    return (
        <MainLayout>
            <FriendListContent
                title={t`pageTitle.friends`}
                infiniteScroll
                currentUser={authService.getCurrentUser() as LoggedInUser}
                status={FriendshipStatus.Accepted}
            />
        </MainLayout>
    )
}
