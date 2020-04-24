import React from 'react'
import Typography from '@material-ui/core/Typography'
import { CircularProgress, Tooltip } from '@material-ui/core'

import { t } from '../../../i18n'
import styles from './RatingIndicator.module.scss'
import { flattenClasses } from '../../../services/Util/StyleUtils'

interface Props {
    rating: number
}

function RatingIndicator(props: Props) {
    const { rating } = props
    const color = flattenClasses([
        rating > 79 && styles.green,
        rating < 41 && styles.red,
        rating > 39 && rating < 80 && styles.yellow,
    ])

    return (
        <>
            <Tooltip title={t`game.criticScore`} placement="top">
                <div className={styles.rating}>
                    <CircularProgress variant="static" value={rating} className={color} />
                    <Typography variant="subtitle1" className={flattenClasses([styles.value, color])}>
                        {Math.round(rating)}
                    </Typography>
                </div>
            </Tooltip>
        </>
    )
}

export default RatingIndicator
