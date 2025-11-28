import React from 'react'

const CalenderIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={512}
            height={512}
            viewBox="0 0 32 32"
            {...props}
        >
            <path
                d="M26.79 4.25h-3.52v-.5a1 1 0 0 0-2 0v.5H10.73v-.5a1 1 0 0 0-2 0v.5H5.21A4.22 4.22 0 0 0 1 8.46V26a4.22 4.22 0 0 0 4.21 4.21h21.58A4.22 4.22 0 0 0 31 26V8.46a4.22 4.22 0 0 0-4.21-4.21Zm-21.58 2h3.52v.5a1 1 0 0 0 2 0v-.5h10.54v.5a1 1 0 0 0 2 0v-.5h3.52A2.21 2.21 0 0 1 29 8.46v2.37H3V8.46a2.21 2.21 0 0 1 2.21-2.21Zm21.58 22H5.21A2.21 2.21 0 0 1 3 26V12.83h26V26a2.21 2.21 0 0 1-2.21 2.25Z"
                data-name="Layer 2"
            />
        </svg>
    )
}

export default CalenderIcon