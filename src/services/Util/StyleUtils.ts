export function flattenClasses(classNames: any[]): string {
    return classNames.filter((className) => Boolean(className)).join(' ');
}
