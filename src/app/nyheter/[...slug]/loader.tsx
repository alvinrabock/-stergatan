import React from 'react'

const loader = () => {
    return (
        <div className="space-y-6 p-4 max-w-4xl mx-auto">
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex space-x-4 animate-pulse">
                    <div className="rounded-md bg-gray-300 dark:bg-gray-700 w-24 h-24 flex-shrink-0" />
                    <div className="flex-1 space-y-4 py-1">
                        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4" />
                        <div className="space-y-2">
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
                            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default loader