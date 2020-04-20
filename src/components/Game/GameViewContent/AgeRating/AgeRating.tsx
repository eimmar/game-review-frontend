import React, { Component } from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'

import { AgeRating as AgeRatingType } from '../../../../services/GameService'
import { t } from '../../../../i18n'

interface Props {
    ageRating: AgeRatingType
}

interface State {
    open: boolean
}

class AgeRating extends Component<Props, State> {
    state = {
        open: false,
    }

    handleModalToggle = () => this.setState((prevState) => ({ open: !prevState.open }))

    render() {
        const { ageRating } = this.props
        const { open } = this.state

        return (
            <div>
                {!ageRating.synopsis && (
                    <Typography display="block" variant="body1">
                        {t(`ageRating.category_${ageRating.category}`)} {t(`ageRating.${ageRating.rating}`)}
                    </Typography>
                )}
                {ageRating.synopsis && (
                    <>
                        <Typography
                            style={{ cursor: 'pointer' }}
                            display="block"
                            variant="body1"
                            color="primary"
                            onClick={this.handleModalToggle}
                        >
                            {t(`ageRating.category_${ageRating.category}`)} {t(`ageRating.${ageRating.rating}`)}
                        </Typography>
                        <Dialog open={open} onClose={this.handleModalToggle}>
                            <DialogTitle>
                                {t(`ageRating.category_${ageRating.category}`)} {t(`ageRating.${ageRating.rating}`)}
                            </DialogTitle>
                            <DialogContent>
                                <DialogContentText>{ageRating.synopsis}</DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={this.handleModalToggle} color="primary">
                                    {t`common.close`}
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </>
                )}
            </div>
        )
    }
}

export default AgeRating
