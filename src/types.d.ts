declare module '*.scss' {
    const classes: {
        [key: string]: string;
    };

    export default classes;
}

declare module '*.png';
declare module '*.svg';
declare module '*.jpg';

declare module 'i18next-fetch-backend' {
    export default Fetch;
}
