import * as React from "react"


export const SortIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={512}
            height={512}
            viewBox="0 0 64 64"
            {...props}
        >
            <path d="M27 59a2 2 0 0 1-2-2V37.77L6.46 17.38A5.61 5.61 0 0 1 10.61 8h42.78a5.61 5.61 0 0 1 4.15 9.38L39 37.77V49a2 2 0 0 1-.75 1.56l-10 8A2 2 0 0 1 27 59zM10.61 12a1.61 1.61 0 0 0-1.19 2.69l19.06 21A2 2 0 0 1 29 37v15.84L35 48V37a2 2 0 0 1 .52-1.35l19.06-21A1.61 1.61 0 0 0 53.39 12z" />
        </svg>
    );
};