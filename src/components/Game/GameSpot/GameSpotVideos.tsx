import React from 'react'
import Typography from '@material-ui/core/Typography'
import { CircularProgress, Button, Divider } from '@material-ui/core'
import Carousel from 'react-multi-carousel'
import 'react-multi-carousel/lib/styles.css'

import { t } from '../../../i18n'
import { gameSpotService, Video } from '../../../services/GameSpotService'
import GameSpotVideo from './GameSpotVideo'
import { Pagination } from '../../../services/RequestService'
import { AbstractPaginator, AbstractPaginatorState } from '../../Pagination/AbstractPaginator'

interface Props {
    gameId: string
    defaultActive?: boolean
}

interface State extends AbstractPaginatorState {
    videos: Video[]
    wasActivated: boolean
}

class GameSpotVideos extends AbstractPaginator<Props, State> {
    state: State = {
        videos: [],
        pagination: {
            page: 1,
            totalResults: 0,
            pageSize: 10,
        },
        loading: false,
        wasActivated: false,
    }

    componentDidMount(): void {
        const { defaultActive } = this.props

        defaultActive && this.activate()
    }

    get carouselConfig() {
        return {
            superLargeDesktop: {
                breakpoint: { max: 4000, min: 3000 },
                items: 7,
            },
            desktop: {
                breakpoint: { max: 3000, min: 1024 },
                items: 5,
            },
            tablet: {
                breakpoint: { max: 1024, min: 464 },
                items: 3,
            },
            mobile: {
                breakpoint: { max: 464, min: 0 },
                items: 1,
            },
        }
    }

    activate = () => {
        const { wasActivated, pagination } = this.state

        !wasActivated && this.fetchData(pagination)
    }

    fetchData = (pagination: Pagination) => {
        this.setState({ wasActivated: true, loading: true })

        const { gameId } = this.props

        gameSpotService
            .videos(gameId, {
                format: 'json',
                limit: pagination.pageSize,
                offset: this.getOffset(pagination),
                sort: 'publish_date:desc',
            })
            .then((response) => {
                this.setState((prevState) => ({
                    videos: prevState.videos.concat(response.results),
                    pagination: {
                        totalResults: response.numberOfTotalResults,
                        page: pagination.page,
                        pageSize: pagination.pageSize,
                    },
                }))
            })
            .finally(() => this.setState({ loading: false }))
    }

    render() {
        const { loading, videos, wasActivated } = this.state

        return (
            <div className="m-b-16">
                <Typography variant="h6">{t`gameSpotVideos.items`}</Typography>
                <Divider className="m-b-8" />

                {wasActivated && (
                    <Carousel responsive={this.carouselConfig} className="game-video-carousel">
                        {videos.map((video, index) => (
                            <GameSpotVideo
                                key={video.id}
                                video={video}
                                {...{
                                    loadMoreCallback:
                                        index + 1 === videos.length && this.hasNextPage
                                            ? () => this.fetchData(this.nextPage)
                                            : undefined,
                                }}
                            />
                        ))}
                    </Carousel>
                )}
                {loading && <CircularProgress />}
                {wasActivated && !loading && videos?.length === 0 && t`gameSpotVideos.noItems`}
                {!wasActivated && (
                    <Button
                        variant="outlined"
                        onClick={this.activate}
                        color="primary"
                    >{t`gameSpotVideos.getItems`}</Button>
                )}
            </div>
        )
    }
}

export default GameSpotVideos
