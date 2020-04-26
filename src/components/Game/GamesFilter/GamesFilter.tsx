import React, { Component } from 'react'
import Grid from '@material-ui/core/Grid'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import {
    Container,
    FormControl,
    InputLabel,
    Select,
    Input,
    Chip,
    MenuItem,
    TextField,
    Button,
    debounce,
} from '@material-ui/core'

import { t } from '../../../i18n'
import { GamesFilterRequest } from '../../../services/GameService'
import { requestService } from '../../../services/RequestService'
import {
    categoryFilters,
    FilterValue,
    gameModeFilters,
    genreFilters,
    platformFilters,
    themeFilters,
} from '../../../services/Util/GameFilterConfiguration'

const styles = ({ spacing, palette }: Theme) =>
    createStyles({
        heroContent: {
            backgroundColor: palette.background.paper,
        },
        formControl: {
            width: '100%',
            marginBottom: spacing(4),
        },
        chips: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        chip: {
            margin: 2,
        },
        noLabel: {
            marginTop: spacing(3),
        },
    })

interface Props extends WithStyles<typeof styles>, RouteComponentProps {
    classes: {
        heroContent: string
        formControl: string
        chips: string
        chip: string
        noLabel: string
    }
}

interface State {
    filters: GamesFilterRequest
}

class GamesFilter extends Component<Props, State> {
    handleInputChange = debounce((name: string, value: string) => {
        const { location, history } = this.props
        const currentUrlParams = new URLSearchParams(location.search)

        currentUrlParams.set(name, value)
        currentUrlParams.set('page', '1')
        history.push(`${location.pathname}?${currentUrlParams.toString()}`)
    }, 800)

    sort = [
        { orderBy: 'name', order: 'asc', label: t`game.sortByNameAsc` },
        { orderBy: 'name', order: 'desc', label: t`game.sortByNameDesc` },
        { orderBy: 'releaseDate', order: 'asc', label: t`game.sortByReleaseDateAsc` },
        { orderBy: 'releaseDate', order: 'desc', label: t`game.sortByReleaseDateDesc` },
        { orderBy: 'rating', order: 'asc', label: t`game.sortByRatingAsc` },
        { orderBy: 'rating', order: 'desc', label: t`game.sortByRatingDesc` },
    ]

    constructor(props: Props) {
        super(props)

        this.state = {
            filters: (requestService.getFilters(props.location.search) as unknown) as GamesFilterRequest,
        }
    }

    get selectMenuProps() {
        const ITEM_HEIGHT = 48
        const ITEM_PADDING_TOP = 8

        return {
            PaperProps: {
                style: {
                    maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                    width: 250,
                },
            },
        }
    }

    get selectedSort() {
        const { filters } = this.state
        const selected =
            this.sort.find((it) => it.order === filters.order && it.orderBy === filters.orderBy) || this.sort[3]

        return selected ? selected.label : ''
    }

    canSort = () => {
        const { location } = this.props
        const currentUrlParams = new URLSearchParams(location.search)

        return Boolean(currentUrlParams.get('query'))
    }

    valueAsArray = (value?: unknown | unknown[]) => {
        if (!value) {
            return []
        }

        return Array.isArray(value) ? value : [String(value)]
    }

    handleMultiSelectChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>, child: React.ReactNode) => {
        const { location, history } = this.props
        const currentUrlParams = new URLSearchParams(location.search)
        const value = this.valueAsArray(event.target.value)

        if (event.target.name) {
            currentUrlParams.delete(event.target.name)
            value.forEach((it) => event.target.name && currentUrlParams.append(event.target.name, String(it)))
            currentUrlParams.set('page', '1')
            history.push(`${location.pathname}?${currentUrlParams.toString()}`)
        }
    }

    handleSortChange = (event: React.ChangeEvent<{ name?: string; value: unknown }>, child: React.ReactNode) => {
        const { location, history } = this.props
        const currentUrlParams = new URLSearchParams(location.search)
        const selected = this.sort.find((it) => it.label === event.target.value) || this.sort[3]

        if (selected) {
            currentUrlParams.set('orderBy', selected.orderBy)
            currentUrlParams.set('order', selected.order)
            currentUrlParams.set('page', '1')
            history.push(`${location.pathname}?${currentUrlParams.toString()}`)
        }
    }

    handleResetFilters = () => {
        const { location, history } = this.props

        history.push(location.pathname)
    }

    renderFilter(value: string | string[] | undefined, label: string, name: string, filterValues: FilterValue[]) {
        const { classes } = this.props

        return (
            <Grid item>
                <FormControl className={classes.formControl}>
                    <InputLabel>{label}</InputLabel>
                    <Select
                        multiple
                        name={name}
                        value={this.valueAsArray(value)}
                        onChange={this.handleMultiSelectChange}
                        input={<Input />}
                        renderValue={(selected) => (
                            <div className={classes.chips}>
                                {(selected as string[]).map((selectedValue) => {
                                    const filterValue = filterValues.find((it) => it.value === selectedValue)

                                    return (
                                        <Chip
                                            color="primary"
                                            key={selectedValue}
                                            label={filterValue ? filterValue.label : ''}
                                            className={classes.chip}
                                        />
                                    )
                                })}
                            </div>
                        )}
                        MenuProps={this.selectMenuProps}
                    >
                        {filterValues.map((it) => (
                            <MenuItem key={it.value} value={it.value}>
                                {it.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        )
    }

    render() {
        const { classes, location } = this.props
        const { filters } = this.state

        return (
            <>
                <Container>
                    <Grid item>
                        <FormControl className={classes.formControl}>
                            <InputLabel>{t`common.sort`}</InputLabel>
                            <Select
                                disabled={this.canSort()}
                                name="sort"
                                value={this.selectedSort}
                                onChange={this.handleSortChange}
                                MenuProps={this.selectMenuProps}
                            >
                                {this.sort.map((it) => (
                                    <MenuItem key={it.label} value={it.label}>
                                        {it.label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    {this.renderFilter(filters.platform, t`game.platform`, 'platform', platformFilters)}

                    <Grid item>
                        <FormControl className={classes.formControl}>
                            <TextField
                                label={t`game.releaseDateFrom`}
                                name="releaseDateFrom"
                                type="date"
                                defaultValue={filters.releaseDateFrom}
                                onChange={(e) => this.handleInputChange(e.target.name, e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item>
                        <FormControl className={classes.formControl}>
                            <TextField
                                label={t`game.releaseDateTo`}
                                name="releaseDateTo"
                                type="date"
                                defaultValue={filters.releaseDateTo}
                                onChange={(e) => this.handleInputChange(e.target.name, e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item>
                        <FormControl className={classes.formControl}>
                            <TextField
                                label={t`game.ratingFrom`}
                                name="ratingFrom"
                                type="number"
                                inputProps={{ min: 0, max: 100, step: 1 }}
                                defaultValue={filters.ratingFrom}
                                onChange={(e) => this.handleInputChange(e.target.name, e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </FormControl>
                    </Grid>

                    <Grid item>
                        <FormControl className={classes.formControl}>
                            <TextField
                                label={t`game.ratingTo`}
                                name="ratingTo"
                                type="number"
                                inputProps={{ min: 0, max: 100, step: 1 }}
                                defaultValue={filters.ratingTo}
                                onChange={(e) => this.handleInputChange(e.target.name, e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                        </FormControl>
                    </Grid>

                    {this.renderFilter(filters.genre, t`game.genre`, 'genre', genreFilters)}
                    {this.renderFilter(filters.theme, t`game.theme`, 'theme', themeFilters)}
                    {this.renderFilter(filters.gameMode, t`game.gameMode`, 'gameMode', gameModeFilters)}
                    {this.renderFilter(filters.category, t`game.category`, 'category', categoryFilters)}

                    {location.search && (
                        <Grid item>
                            <FormControl className={classes.formControl}>
                                <Button
                                    style={{ maxWidth: 300 }}
                                    variant="contained"
                                    color="secondary"
                                    onClick={this.handleResetFilters}
                                >{t`filters.reset`}</Button>
                            </FormControl>
                        </Grid>
                    )}
                </Container>
            </>
        )
    }
}

export default withRouter(withStyles(styles)(GamesFilter))
