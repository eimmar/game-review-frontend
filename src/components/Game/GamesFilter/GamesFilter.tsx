import React, { ChangeEvent, Component } from 'react'
import Grid from '@material-ui/core/Grid'
import { createStyles, Theme, withStyles, WithStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { Container, FormControl, InputLabel, Select, Input, Chip, MenuItem, TextField, Button } from '@material-ui/core'

import { t } from '../../../i18n'
import { GameEntityFilterValues, GamesFilterRequest } from '../../../services/GameService'
import { requestService } from '../../../services/RequestService'

const styles = ({ palette, spacing, breakpoints }: Theme) =>
    createStyles({
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
    constructor(props: Props) {
        super(props)

        this.state = {
            filters: requestService.getFilters(props.location.search) as GamesFilterRequest,
        }
    }

    get multiSelectMenuProps() {
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

    valueAsArray = (value?: unknown | unknown[]) => {
        if (!value) {
            return []
        }

        return Array.isArray(value) ? value : [String(value)]
    }

    handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { location, history } = this.props
        const currentUrlParams = new URLSearchParams(location.search)

        if (event.target.name) {
            currentUrlParams.set(event.target.name, event.target.value)
            currentUrlParams.set('page', '1')
            history.push(`${location.pathname}?${currentUrlParams.toString()}`)
        }
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

    handleResetFilters = () => {
        const { location, history } = this.props

        history.push(location.pathname)
    }

    render() {
        const { classes, genres, themes, gameModes, companies, platforms } = this.props
        const { filters } = this.state

        return (
            <Container>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
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
                                MenuProps={this.multiSelectMenuProps}
                            >
                                {themes.map((it) => (
                                    <MenuItem key={it.id} value={it.id}>
                                        {it.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
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
                                MenuProps={this.multiSelectMenuProps}
                            >
                                {genres.map((it) => (
                                    <MenuItem key={it.id} value={it.id}>
                                        {it.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
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
                                MenuProps={this.multiSelectMenuProps}
                            >
                                {platforms.map((it) => (
                                    <MenuItem key={it.id} value={it.id}>
                                        {it.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
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
                                MenuProps={this.multiSelectMenuProps}
                            >
                                {gameModes.map((it) => (
                                    <MenuItem key={it.id} value={it.id}>
                                        {it.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
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
                                MenuProps={this.multiSelectMenuProps}
                            >
                                {companies.map((it) => (
                                    <MenuItem key={it.id} value={it.id}>
                                        {it.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6}>
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
                                MenuProps={this.multiSelectMenuProps}
                            >
                                {['0', '1', '2', '3', '4'].map((it) => (
                                    <MenuItem key={it} value={it}>
                                        {t(`gameCategory.${it}`)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid container xs={12} sm={6}>
                        <Grid item xs={12} sm={6}>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    label={t`game.releaseDateFrom`}
                                    name="releaseDateFrom"
                                    type="date"
                                    defaultValue={filters.releaseDateFrom}
                                    onChange={this.handleInputChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    label={t`game.releaseDateTo`}
                                    name="releaseDateTo"
                                    type="date"
                                    defaultValue={filters.releaseDateTo}
                                    onChange={this.handleInputChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid container xs={12} sm={6}>
                        <Grid item xs={12} sm={6}>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    label={t`game.ratingFrom`}
                                    name="ratingFrom"
                                    type="date"
                                    defaultValue={filters.ratingFrom}
                                    onChange={this.handleInputChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl className={classes.formControl}>
                                <TextField
                                    label={t`game.ratingTo`}
                                    name="ratingTo"
                                    type="date"
                                    defaultValue={filters.ratingTo}
                                    onChange={this.handleInputChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Grid container xs={12} sm={6}>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={this.handleResetFilters}
                        >{t`filters.reset`}</Button>
                    </Grid>
                </Grid>
            </Container>
        )
    }
}

export default withRouter(withStyles(styles)(GamesFilter))