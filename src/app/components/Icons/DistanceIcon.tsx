import React from 'react'

const DistanceIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={512}
            height={512}
            viewBox="0 0 24 24"
            {...props}
        >
            <path d="M23 23H13a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2zM23 13H13a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2zM23 3H13a1 1 0 1 1 0-2h10a1 1 0 1 1 0 2zM8.249 19H6V5h2.249a.752.752 0 0 0 .75-.75.753.753 0 0 0-.2-.511l-3.25-3.5a.753.753 0 0 0-1.099 0l-3.25 3.5A.75.75 0 0 0 1.749 5H4v14H1.749a.752.752 0 0 0-.688.45.754.754 0 0 0 .138.811l3.25 3.5a.756.756 0 0 0 1.1 0l3.25-3.5a.753.753 0 0 0 .138-.811.75.75 0 0 0-.688-.45z" />
        </svg>
    )
}

export default DistanceIcon