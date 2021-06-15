
export function concat(...args: any) {
    return args.reduce((acc: any, val: any) => [...acc, ...val]);
}
