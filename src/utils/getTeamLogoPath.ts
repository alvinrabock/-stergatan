import { lowercase } from "@/utillities/lowercase";

export const getTeamLogoPath = (teamName: string) => {
    const formattedName = lowercase(teamName);
    return `/logos/${formattedName}.svg`;
};