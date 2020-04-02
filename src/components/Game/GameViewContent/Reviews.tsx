import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Grid, Divider } from '@material-ui/core'

import { t } from '../../../i18n'

const styles = ({ spacing, typography }: Theme) =>
    createStyles({
        markdown: {
            ...typography.body2,
            padding: spacing(3, 0),
        },
    })

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    gameId: string
    classes: {
        markdown: string
    }
}

// eslint-disable-next-line react/prefer-stateless-function
class Reviews extends Component<Props> {
    render() {
        const { classes } = this.props

        return (
            <Grid item xs={12} md={8}>
                <Typography variant="h6" gutterBottom>{t`game.userReviews`}</Typography>
                <Divider />
                {/* {posts.map((post) => ( */}
                {/*    // <Markdown className={classes.markdown} key={post.substring(0, 40)}> */}
                {/*        {post} */}
                {/*    // </Markdown> */}
                {/* ))} */}
            </Grid>
        )
    }
}

export default withRouter(withStyles(styles)(Reviews))
