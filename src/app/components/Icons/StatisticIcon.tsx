import React from 'react'

const StatisticIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={512}
            height={512}
            viewBox="0 0 64 64"
            {...props}
        >
            <path d="M59 53.35h-2.81v-42.7a2.006 2.006 0 0 0-2-2h-5.55a2 2 0 0 0-2 2v42.7h-3.39V23.76a2.006 2.006 0 0 0-2-2H35.7a2 2 0 0 0-2 2v29.59h-3.4v-12.3a2 2 0 0 0-2-2h-5.55a2.006 2.006 0 0 0-2 2v12.3h-3.39V33.69a2 2 0 0 0-2-2H9.81a2.006 2.006 0 0 0-2 2v19.66H5a1 1 0 0 0 0 2h54a1 1 0 0 0 0-2z" />
        </svg>
    )
}

export default StatisticIcon;
