import MaxWidthWrapper from "../MaxWidthWrapper";

export default function PopularProductsSkeleton() {
    return (
        <div className="w-full py-10 bg-custom-dark-red text-white">
            <MaxWidthWrapper>
                <div className="flex flex-row gap-4 items-center mb-10">
                    <h2 className="text-4xl uppercase font-semibold animate-pulse bg-gray-700 h-8 w-72 rounded-md"></h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, index) => (
                        <div key={index} className="animate-pulse space-y-4">
                            <div className="w-full h-44 bg-gray-600 rounded-md"></div>
                            <div className="h-6 w-3/4 bg-gray-500 rounded-md"></div>
                            <div className="h-4 w-1/2 bg-gray-500 rounded-md"></div>
                        </div>
                    ))}
                </div>
            </MaxWidthWrapper>
        </div>
    );
}
