declare module '*.scss' {
    const classes: {
        [key: string]: string
    }

    export default classes
}

declare module '*.png'
declare module '*.svg'
declare module '*.jpg'

declare module 'i18next-fetch-backend' {
    export default Fetch
}

declare module 'react-show-more' {
    declare interface ShowMoreProps {
        children?: React.ReactElement
        lines: boolean | number
        more: string | React.ReactElement
        less: string | React.ReactElement
        anchorClass?: string
    }

    export default function ShowMore(props: ShowMoreProps): JSX.Element
}

declare interface Timestampable {
    createdAt: string
    updatedAt: string
}

declare interface ExternalEntity {
    externalId: number
}
