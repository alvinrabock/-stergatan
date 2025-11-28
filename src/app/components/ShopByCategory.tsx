import Image from "next/image"
import Link from "next/link"
import MaxWidthWrapper from "./MaxWidthWrapper"

const categories = [
    {
        id: 1,
        name: "Presenter till Studenten",
        image: "/BB250405MA197.webp",
        href: "https://ostersifshop.se/",
    },
    {
        id: 2,
        name: "Matchtröja 2025",
        image: "/BB250405MA197.webp",
        href: "https://ostersifshop.se/matchdag",
    },
    {
        id: 3,
        name: "Adidaskollektionen",
        image: "/BB250405MA197.webp",
        href: "https://ostersifshop.se/adidas",
    },
    {
        id: 4,
        name: "Barnkollektionen",
        image: "/BB250405MA197.webp",
        href: "https://ostersifshop.se/barn",
    },
]

export default function ShopByCategory() {
    return (
        <div>
            <h2>Kategorier från shoppen</h2>
            <section className="w-full py-12 md:py-20 lg:py-24 text-white">
                <MaxWidthWrapper>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {categories.map((category) => (
                            <Link
                                target="_blank"
                                key={category.id}
                                href={category.href}
                                className="group relative overflow-hidden rounded-lg bg-background shadow-lg transition-all hover:shadow-2xl h-full min-h-[280px]"
                            >
                        <div className="relative h-full">
                            <Image
                                src={category.image}
                                alt={category.name}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-custom_dark_red/50 group-hover:bg-black/30 transition-colors duration-300" />
                            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 z-10">
                                <div className="text-white">
                                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-2 group-hover:text-primary-foreground transition-colors">
                                        {category.name}
                                    </h3>

                                </div>
                            </div>
                        </div>
                    </Link>
                        ))}
                </div>
            </MaxWidthWrapper>
        </section>
        </div >
    )
}
