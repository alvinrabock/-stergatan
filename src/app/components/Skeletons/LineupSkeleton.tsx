"use client";

const LineupSkeleton = () => {
    const rows = [1, 4, 4, 2]; // Fake formation layout for skeleton

    return (
        <div className="mb-6 relative animate-pulse">
            <div className="relative w-full max-w-[700px] h-[500px] sm:h-[600px] mx-auto bg-gray-100 rounded-lg overflow-hidden">
                <div className="absolute inset-0 z-0 bg-gradient-to-b from-gray-200 to-gray-400 opacity-40 rounded-lg" />

                <div className="relative z-10 min-h-full w-full flex flex-col-reverse justify-between px-2 sm:px-4 py-3 sm:py-4">
                    {/* Goalkeeper */}
                    <div className="flex justify-center items-center mb-1 sm:mb-2">
                        <div className="flex flex-col items-center gap-1 sm:gap-2">
                            <div className="w-10 h-10 sm:w-[60px] sm:h-[60px] bg-gray-300 rounded-full" />
                            <div className="w-16 h-5 sm:w-[100px] sm:h-[30px] bg-gray-400 rounded-md" />
                        </div>
                    </div>

                    {/* Fake formation rows */}
                    {rows.map((num, i) => (
                        <div key={i} className="flex justify-center gap-1 sm:gap-3 md:gap-6 lg:gap-8 mb-1 sm:mb-2">
                            {Array(num).fill(null).map((_, j) => (
                                <div key={j} className="flex flex-col items-center gap-1 sm:gap-2">
                                    <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-[60px] md:h-[60px] bg-gray-300 rounded-full shrink-0" />
                                    <div className="w-12 h-4 sm:w-16 sm:h-5 md:w-20 md:h-6 lg:w-[100px] lg:h-[30px] bg-gray-400 rounded-md shrink-0" />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LineupSkeleton;
