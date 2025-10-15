export const getHealthStatus = (ztotal) => {
    if (typeof ztotal !== "number") return "Unknown";
    if (ztotal < 1.0) return "Excellent Health";
    else if (ztotal <= 1.99) return "Good Health";
    else if (ztotal <= 2.99) return "Moderate Health";
    else return "Bad Health";
};
