import React from 'react'
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
import { AbstractPaginator, AbstractPaginatorState } from '../../Pagination/AbstractPaginator'
import { Pagination } from '../../../services/RequestService'

const styles = ({ spacing, typography, palette }: Theme) =>
    createStyles({
        markdown: {
            ...typography.body2,
            padding: spacing(3, 0),
        },
        avatar: {
            backgroundColor: palette.warning.main,
        },
        moreDeals: {
            backgroundColor: palette.primary.main,
        },
        oldPrice: {
            textDecoration: 'line-through',
            color: palette.text.secondary,
            textDecorationColor: palette.text.secondary,
        },
        discount: {
            color: palette.success.main,
            marginLeft: 4,
        },
    })

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    query: string
    country?: string
    classes: {
        markdown: string
        avatar: string
        moreDeals: string
        oldPrice: string
        discount: string
    }
}

interface State extends AbstractPaginatorState {
    deals: GameDeal[]
    visibleDeals: GameDeal[]
    moreDealsUrl: string | null
    loading: boolean
    fetched: boolean
}

class PriceDeal extends AbstractPaginator<Props, State> {
    state: State = {
        deals: [] as GameDeal[],
        visibleDeals: [] as GameDeal[],
        moreDealsUrl: null,
        loading: true,
        fetched: false,
        pagination: {
            page: 1,
            totalResults: 0,
            pageSize: 5,
        },
    }

    fetchDeals = () => {
        this.setState({ fetched: true })

        const { query, country } = this.props
        const { pagination } = this.state

        gameDealService
            .search({ query, country })
            .then((response) => {
                const deals = response.data.list.sort((a, b) => (a.priceNew > b.priceNew ? 1 : -1))
                const moreDealsUrl = response.data.list[0] ? response.data.list[0].urls.game : null
                const visibleDeals = deals.slice(this.offset, pagination.pageSize)

                this.setState({
                    deals,
                    visibleDeals,
                    moreDealsUrl,
                    pagination: { ...pagination, totalResults: deals.length },
                })
            })
            .finally(() => this.setState({ loading: false }))
    }

    handleShowMore = (pagination: Pagination) => {
        const { deals, visibleDeals } = this.state
        const newVisibleDeals = visibleDeals.concat(
            deals.slice(this.getOffset(pagination), this.getOffset(pagination) + pagination.pageSize),
        )

        this.setState({ pagination, visibleDeals: newVisibleDeals })
    }

    renderFinalPrice = (price: number) => {
        return price === 0 ? t`common.free` : `${this.round(price)} €`
    }

    round = (number: number) => Math.round((number + Number.EPSILON) * 100) / 100

    renderDeals() {
        const { visibleDeals, moreDealsUrl, pagination } = this.state
        const { classes } = this.props

        return (
            <List>
                {visibleDeals &&
                    visibleDeals.map((it) => (
                        <ListItem key={it.urls.buy} button href={it.urls.buy} component="a" target="_blank">
                            <ListItemAvatar>
                                <Avatar className={classes.avatar}>
                                    <LocalOfferIcon />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={it.title} secondary={this.renderDeal(it)} />
                        </ListItem>
                    ))}
                {moreDealsUrl && visibleDeals.length === pagination.totalResults && (
                    <ListItem button href={moreDealsUrl} target="_blank" component="a">
                        <ListItemAvatar>
                            <Avatar className={classes.moreDeals}>
                                <MoreIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={t`gameDeal.more`} />
                    </ListItem>
                )}
                {visibleDeals?.length === 0 && t`gameDeal.noDealsFound`}
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
                            {this.renderFinalPrice(deal.priceNew)}{' '}
                        </Typography>
                        <Typography component="span" className={classes.oldPrice}>
                            {this.round(deal.priceOld)} €{' '}
                        </Typography>
                        <Typography component="span" className={classes.discount}>
                            {-deal.priceCut}%
                        </Typography>
                    </>
                )}
                {deal.priceCut === 0 && this.renderFinalPrice(deal.priceNew)}
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
                    {!loading && this.hasNextPage && (
                        <Button
                            variant="contained"
                            onClick={() => this.handleShowMore(this.nextPage)}
                            color="primary"
                        >{t`common.more`}</Button>
                    )}
                </Box>
            </Grid>
        )
    }
}

export default withRouter(withStyles(styles)(PriceDeal))
