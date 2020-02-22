import Loadable from 'react-loadable';
import React from 'react';

export function lazyComponent(componentImport: any, componentProps?: object) {
    return Loadable({
        loader: async () => componentImport,
        render(loaded: { default: any }, props: object) {
            const Component = loaded.default;

            return <Component {...{ ...props, ...componentProps }} />;
        },
        loading() {
            return <div>Loading...</div>;
        },
    });
}
