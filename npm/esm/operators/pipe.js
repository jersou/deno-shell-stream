export const pipe = (...operators) => (shellStream) => {
    let current = shellStream;
    for (const operator of operators) {
        current = operator(current);
    }
    return current;
};
