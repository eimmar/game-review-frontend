import * as React from 'react'
import { useLocation } from 'react-router-dom'

import { MainLayout } from '../../layouts/MainLayout/MainLayout'
import UserListContent from '../../components/User/UserListContent/UserListContent'
import UsersFilter from '../../components/User/UsersFilter/UsersFilter'
import { t } from '../../i18n'

export default function UserList() {
    const location = useLocation()

    document.title = `${t`pageTitle.userList`} - ${t`common.websiteName`}`

    return (
        <MainLayout key={location.key}>
            <UsersFilter />
            <UserListContent />
        </MainLayout>
    )
}
