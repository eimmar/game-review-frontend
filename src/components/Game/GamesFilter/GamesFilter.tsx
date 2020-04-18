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
    Typography,
    CssBaseline,
} from '@material-ui/core'

import { t } from '../../../i18n'
import { GameEntityFilterValues, GamesFilterRequest } from '../../../services/GameService'
import { requestService } from '../../../services/RequestService'

const styles = ({ spacing, palette }: Theme) =>
    createStyles({
        heroContent: {
            backgroundColor: palette.background.paper,
            padding: spacing(8, 0, 6),
        },
        formControl: {
            margin: spacing(1),
            width: '100%',
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

interface Props extends WithStyles<typeof styles>, RouteComponentProps, GameEntityFilterValues {
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
        { orderBy: 'name', order: 'ASC', label: t`game.sortByNameAsc` },
        { orderBy: 'name', order: 'DESC', label: t`game.sortByNameDesc` },
        { orderBy: 'releaseDate', order: 'ASC', label: t`game.sortByReleaseDateAsc` },
        { orderBy: 'releaseDate', order: 'DESC', label: t`game.sortByReleaseDateDesc` },
        { orderBy: 'rating', order: 'ASC', label: t`game.sortByRatingAsc` },
        { orderBy: 'rating', order: 'DESC', label: t`game.sortByRatingDesc` },
    ]

    constructor(props: Props) {
        super(props)

        this.state = {
            filters: requestService.getFilters(props.location.search) as GamesFilterRequest,
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

    render() {
        const { classes, genres, themes, gameModes, companies, platforms } = this.props
        const { filters } = this.state

        return (
            <>
                <CssBaseline />
                <div className={classes.heroContent}>
                    <Container maxWidth="sm">
                        <Typography component="h1" variant="h4" align="center" color="textPrimary" gutterBottom>
                            {t`game.listHeader`}
                        </Typography>
                    </Container>
                    <Container>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel>{t`game.theme`}</InputLabel>
                                    <Select
                                        multiple
                                        name="theme"
                                        value={this.valueAsArray(filters.theme)}
                                        onChange={this.handleMultiSelectChange}
                                        input={<Input />}
                                        renderValue={(selected) => (
                                            <div className={classes.chips}>
                                                {(selected as string[]).map((id) => {
                                                    const theme = themes.find((it) => it.id === id)

                                                    return (
                                                        <Chip
                                                            color="primary"
                                                            key={id}
                                                            label={theme ? theme.name : ''}
                                                            className={classes.chip}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        )}
                                        MenuProps={this.selectMenuProps}
                                    >
                                        {themes.map((it) => (
                                            <MenuItem key={it.id} value={it.id}>
                                                {it.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel>{t`game.genre`}</InputLabel>
                                    <Select
                                        multiple
                                        name="genre"
                                        value={this.valueAsArray(filters.genre)}
                                        onChange={this.handleMultiSelectChange}
                                        input={<Input />}
                                        renderValue={(selected) => (
                                            <div className={classes.chips}>
                                                {(selected as string[]).map((id) => {
                                                    const genre = genres.find((it) => it.id === id)

                                                    return (
                                                        <Chip
                                                            color="primary"
                                                            key={id}
                                                            label={genre ? genre.name : ''}
                                                            className={classes.chip}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        )}
                                        MenuProps={this.selectMenuProps}
                                    >
                                        {genres.map((it) => (
                                            <MenuItem key={it.id} value={it.id}>
                                                {it.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel>{t`game.platform`}</InputLabel>
                                    <Select
                                        multiple
                                        name="platform"
                                        value={this.valueAsArray(filters.platform)}
                                        onChange={this.handleMultiSelectChange}
                                        input={<Input />}
                                        renderValue={(selected) => (
                                            <div className={classes.chips}>
                                                {(selected as string[]).map((id) => {
                                                    const platform = platforms.find((it) => it.id === id)

                                                    return (
                                                        <Chip
                                                            color="primary"
                                                            key={id}
                                                            label={platform ? platform.name : ''}
                                                            className={classes.chip}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        )}
                                        MenuProps={this.selectMenuProps}
                                    >
                                        {platforms.map((it) => (
                                            <MenuItem key={it.id} value={it.id}>
                                                {it.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel>{t`game.gameMode`}</InputLabel>
                                    <Select
                                        multiple
                                        name="gameMode"
                                        value={this.valueAsArray(filters.gameMode)}
                                        onChange={this.handleMultiSelectChange}
                                        input={<Input />}
                                        renderValue={(selected) => (
                                            <div className={classes.chips}>
                                                {(selected as string[]).map((id) => {
                                                    const gameMode = gameModes.find((it) => it.id === id)

                                                    return (
                                                        <Chip
                                                            color="primary"
                                                            key={id}
                                                            label={gameMode ? gameMode.name : ''}
                                                            className={classes.chip}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        )}
                                        MenuProps={this.selectMenuProps}
                                    >
                                        {gameModes.map((it) => (
                                            <MenuItem key={it.id} value={it.id}>
                                                {it.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel>{t`game.company`}</InputLabel>
                                    <Select
                                        multiple
                                        name="company"
                                        value={this.valueAsArray(filters.company)}
                                        onChange={this.handleMultiSelectChange}
                                        input={<Input />}
                                        renderValue={(selected) => (
                                            <div className={classes.chips}>
                                                {(selected as string[]).map((id) => {
                                                    const company = companies.find((it) => it.id === id)

                                                    return (
                                                        <Chip
                                                            color="primary"
                                                            key={id}
                                                            label={company ? company.name : ''}
                                                            className={classes.chip}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        )}
                                        MenuProps={this.selectMenuProps}
                                    >
                                        {companies.map((it) => (
                                            <MenuItem key={it.id} value={it.id}>
                                                {it.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel>{t`game.category`}</InputLabel>
                                    <Select
                                        multiple
                                        name="category"
                                        value={this.valueAsArray(filters.category)}
                                        onChange={this.handleMultiSelectChange}
                                        input={<Input />}
                                        renderValue={(selected) => (
                                            <div className={classes.chips}>
                                                {(selected as string[]).map((it) => {
                                                    return (
                                                        <Chip
                                                            color="primary"
                                                            key={it}
                                                            label={t(`gameCategory.${it}`)}
                                                            className={classes.chip}
                                                        />
                                                    )
                                                })}
                                            </div>
                                        )}
                                        MenuProps={this.selectMenuProps}
                                    >
                                        {['0', '1', '2', '3', '4'].map((it) => (
                                            <MenuItem key={it} value={it}>
                                                {t(`gameCategory.${it}`)}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={3}>
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

                            <Grid item xs={12} sm={3}>
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

                            <Grid item xs={12} sm={3}>
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

                            <Grid item xs={12} sm={3}>
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

                            <Grid item xs={12} sm={3}>
                                <FormControl className={classes.formControl}>
                                    <InputLabel>{t`common.sort`}</InputLabel>
                                    <Select
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

                            <Grid item xs={12} sm={6} md={3}>
                                <FormControl className={classes.formControl}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={this.handleResetFilters}
                                    >{t`filters.reset`}</Button>
                                </FormControl>
                            </Grid>
                        </Grid>
                    </Container>
                </div>
            </>
        )
    }
}

export default withRouter(withStyles(styles)(GamesFilter))
