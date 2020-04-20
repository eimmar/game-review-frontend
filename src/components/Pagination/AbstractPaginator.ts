import { Component } from 'react'

import { Pagination } from '../../services/RequestService'

export interface AbstractPaginatorState {
    pagination: Pagination
    loading: boolean
}

export abstract class AbstractPaginator<P = {}, S = {}> extends Component<P, AbstractPaginatorState & S> {
    get hasNextPage() {
        const { pagination } = this.state

        return pagination.page * pagination.pageSize < pagination.totalResults
    }

    get nextPage() {
        const { pagination } = this.state

        return { ...pagination, page: pagination.page + 1 }
    }

    get totalPages() {
        const { pagination } = this.state

        return Math.ceil(pagination.totalResults / pagination.pageSize)
    }

    get currentPage() {
        const { pagination } = this.state

        return pagination.page
    }

    get offset() {
        const { pagination } = this.state

        return (pagination.page - 1) * pagination.pageSize
    }

    getOffset(pagination: Pagination) {
        return (pagination.page - 1) * pagination.pageSize
    }
}
