export const formatK = (val: number) => {
    if (Math.abs(val) >= 1000) {
        return `${(val / 1000).toFixed(0)}k`;
    }
    return val.toString();
};

export const formatFullK = (val: number) => {
    return formatK(val);
};
