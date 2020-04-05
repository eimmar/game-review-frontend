import React, { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import {
    Grid,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    Box,
    Button,
    CircularProgress,
} from '@material-ui/core'
import LocalOfferIcon from '@material-ui/icons/LocalOffer'
import MoreIcon from '@material-ui/icons/More'

import { t } from '../../../i18n'
import { gameDealService, GameDeal } from '../../../services/GameDealService'

const styles = ({ spacing, typography, palette }: Theme) =>
    createStyles({
        markdown: {
            ...typography.body2,
            padding: spacing(3, 0),
        },
        oldPrice: {
            textDecoration: 'line-through',
            color: palette.text.secondary,
            textDecorationColor: palette.text.secondary,
        },
        discount: {
            color: palette.success.dark,
        },
    })

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    query: string
    classes: {
        markdown: string
        oldPrice: string
        discount: string
    }
}

interface State {
    deals: GameDeal[] | null
    moreDealsUrl: string | null
    loading: boolean
    fetched: boolean
}

class PriceDeal extends Component<Props, State> {
    state: State = {
        deals: null,
        moreDealsUrl: null,
        loading: true,
        fetched: false,
    }

    fetchDeals = () => {
        this.setState({ fetched: true })

        const { query } = this.props

        gameDealService
            .search({ query })
            .then((response) => {
                const deals = response.data.list
                const moreDealsUrl = response.data.list[0] ? response.data.list[0].urls.game : null

                this.setState({ deals, moreDealsUrl })
            })
            .finally(() => this.setState({ loading: false }))
    }

    renderDeals() {
        const { deals, moreDealsUrl } = this.state

        return (
            <List>
                {deals &&
                    deals.map((it) => (
                        <ListItem key={it.plain} button href={it.urls.buy} component="a" target="_blank">
                            <ListItemAvatar>
                                <Avatar>
                                    <LocalOfferIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={it.title} secondary={this.renderDeal(it)} />
                        </ListItem>
                    ))}
                {moreDealsUrl && (
                    <ListItem button href={moreDealsUrl} target="_blank" component="a">
                        <ListItemAvatar>
                            <Avatar>
                                <MoreIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={t`gameDeal.more`} />
                    </ListItem>
                )}
                {deals?.length === 0 && t`gameDeal.noDealsFound`}
            </List>
        )
    }

    renderDeal(deal: GameDeal) {
        const { classes } = this.props

        return (
            <Box mr={1} display="inline" component="span">
                <Typography component="span" display="block" variant="body2" color="textPrimary">
                    {deal.shop.name}
                </Typography>

                {deal.priceCut > 0 && (
                    <>
                        <Typography component="span" color="textPrimary">
                            {deal.priceNew} €{' '}
                        </Typography>
                        <Typography component="span" className={classes.oldPrice}>
                            {deal.priceOld} €{' '}
                        </Typography>
                        <Typography component="span" className={classes.discount}>
                            {deal.priceCut}%
                        </Typography>
                    </>
                )}
                {deal.priceCut === 0 && `${deal.priceNew} €`}
            </Box>
        )
    }

    render() {
        const { loading, fetched } = this.state

        return (
            <Grid item>
                <Typography variant="h6" gutterBottom>{t`game.gameDeals`}</Typography>
                <Divider />
                <Box mt={2} mb={2}>
                    {!fetched && (
                        <Button
                            variant="outlined"
                            onClick={this.fetchDeals}
                            color="primary"
                        >{t`gameDeal.getDeals`}</Button>
                    )}
                    {fetched && loading && <CircularProgress />}
                    {fetched && !loading && this.renderDeals()}
                </Box>
            </Grid>
        )
    }
}

export default withRouter(withStyles(styles)(PriceDeal))
