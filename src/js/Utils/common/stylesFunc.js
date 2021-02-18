export function padding(a = 0, b, c, d) {
    return {
        paddingTop: a,
        paddingRight: b || a,
        paddingBottom: c || a,
        paddingLeft: d || a
    };
}
