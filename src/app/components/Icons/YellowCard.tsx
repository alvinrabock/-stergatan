import React from 'react'

const YellowCard = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 8.467 8.467"
            {...props}
        >
            <path
                className="fill-yellow-400"
                strokeWidth={0.929}
                d="M2.303.53h3.865a.695.695 0 0 1 .694.694v6.022a.695.695 0 0 1-.694.695H2.303a.695.695 0 0 1-.695-.695V1.224A.695.695 0 0 1 2.303.53z"
            />
        </svg>
    )
}

export default YellowCard