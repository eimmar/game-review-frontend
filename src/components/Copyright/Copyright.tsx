import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

import { t } from '../../i18n'
import { routes } from '../../parameters'

export default function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {t`common.copyright`}{' '}
            <Link color="inherit" component={RouterLink} to={routes.homePage}>{t`common.websiteName`}</Link>{' '}
            {new Date().getFullYear()}
        </Typography>
    )
}
