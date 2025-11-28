export const lowercase = (teamName: string) => {
    if (!teamName) return "";
    return teamName
        .toLowerCase()
        .replace(/[åä]/g, "a")
        .replace(/[ö]/g, "o")
        .replace(/\s+/g, "-");
};
