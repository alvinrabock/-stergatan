import React from 'react'

const FlagIcon = (props: React.SVGProps<SVGSVGElement>) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            data-name="Layer 1"
            viewBox="0 0 64 64"
            {...props}
        >
            <path d="M13.61 4c-.792 0-1.436.644-1.436 1.436v53.129c0 .792.644 1.436 1.436 1.436s1.436-.644 1.436-1.436V5.436c0-.792-.644-1.436-1.436-1.436zM50.741 15.423h-.079c-5.792 0-11.601-1.821-17.265-5.411-5.859-3.713-13.8-3.153-16.352-2.851v23.624l3.362-2.383c5.234-3.71 11.177-5.886 17.187-6.292 6.625-.447 11.109-4.427 13.146-6.687z" />
        </svg>
    )
}

export default FlagIcon