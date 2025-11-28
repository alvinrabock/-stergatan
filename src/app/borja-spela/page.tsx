import Link from 'next/link';
import Image from 'next/image';
import MaxWidthWrapper from '../components/MaxWidthWrapper';
import { Card, CardDescription, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/Button';

export default function BorjaSpelaPage() {

    const schools = [
        {
            id: 'procivitas-vaxjo',
            name: 'ProCivitas Växjö',
            description: 'En skola för dig som vill kombinera elitidrott med högskolestudier.',
            imageUrl: '/BB250405MA197.webp',
            slug: 'procivitas-vaxjo'
        },
        {
            id: 'prolympia-vaxjo',
            name: 'Prolympia Växjö',
            description: 'Idrottsskolan i Arenastaden för dig som vill satsa på din idrott.',
            imageUrl: '/BB250405MA197.webp',
            slug: 'prolympia-vaxjo'
        },
    ];

    return (
        <main className="bg-white pt-40">
            <MaxWidthWrapper className='pb-20'>
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4">
                        Spela fotboll i Östers IF
                    </h1>
                    <p className="text-base md:text-lg text-gray-700 max-w-2xl mx-auto">
                        Det är för närvarande många som vill börja spela för oss. Läs mer nedan om vad som gäller för respektive åldersgrupp.
                    </p>
                </div>

                {/* Grid layout for sections */}
                <div className="grid  grid-cols-3 gap-10">
                    {/* 6–15 år */}
                    <SectionCard
                        title="Är ditt barn 6–15 år?"
                        image={{
                            src: '/images/kids-football.jpg',
                            alt: 'Barn som spelar fotboll',
                        }}
                    >
                        <p className="mb-4">
                            Gör en intresseanmälan för att börja spela i Östers IF. Vi kontaktar dig när det finns plats i rätt åldersgrupp.
                        </p>
                        <Link href="/intresseanmalan" className="text-blue-600 underline font-medium">
                            Gör intresseanmälan
                        </Link>
                    </SectionCard>

                    {/* Född 2020 */}
                    <SectionCard
                        title="Född 2020?"
                        image={{
                            src: '/images/kul-med-boll.jpg',
                            alt: 'Kul med Boll-träning',
                        }}
                    >
                        <p>
                            Välkommen till <strong>Kul med Boll</strong> – vår första nivå för flickor och pojkar födda 2020.
                        </p>
                        <p className="mt-2">
                            Här introducerar vi fotbollen genom lek, rörelse och glädje.
                        </p>
                        <p className="mt-4 font-medium">
                            Kontakt:{' '}
                            <a href="mailto:info@ostersif.se" className="text-blue-600 underline">
                                info@ostersif.se
                            </a>
                        </p>
                    </SectionCard>

                    {/* Verksamhet intro */}
                    <SectionCard
                        title="Om vår barn- och ungdomsverksamhet"
                        image={{
                            src: '/images/youth-program.jpg',
                            alt: 'Ungdomsverksamhet Östers IF',
                        }}
                    >
                        <p className="mb-4">
                            Vår verksamhet sträcker sig från 5 till 19 år och utgår från ett breddtänk i de yngre åren med en naturlig stegring mot elit i de äldre.
                            Östers IF har över 500 aktiva ungdomsspelare och cirka 70 ledare.
                        </p>
                        <Link href="https://ostersif.se/akademi-ungdom" target="_blank" className="text-blue-600 underline font-medium">
                            Besök Akademi- & Ungdomssidan
                        </Link>
                    </SectionCard>

                    {/* Akademi */}
                    <SectionCard
                        title="Akademi 13–19 år"
                        image={{
                            src: '/images/academy-training.jpg',
                            alt: 'Akademiträning i Östers IF',
                        }}
                    >
                        <p className="mb-2">
                            Akademin erbjuder en tydlig väg från ungdomsfotboll till A-lagsverksamhet. Här kombineras skola och fotboll genom samarbete med:
                        </p>
                        <ul className="list-disc pl-5 space-y-1 text-gray-700">
                            <li>Thorén Framtid (årskurs 6–9)</li>
                            <li>Procivitas (gymnasium)</li>
                            <li>Över 20 samverkande klubbar i regionen</li>
                        </ul>
                        <p className="mt-2">
                            Målet är att utbilda spelare för framtidens elitfotboll.
                        </p>
                    </SectionCard>

                    {/* Ungdom */}
                    <SectionCard
                        title="Ungdom 5–12 år"
                        image={{
                            src: '/images/young-players.jpg',
                            alt: 'Yngre spelare i Östers IF',
                        }}
                    >
                        <p>
                            Våra yngsta spelare börjar med <strong>Kul med Boll</strong>. Därefter tränas spelarna av utbildade föräldraledare enligt föreningens riktlinjer
                            för fotbollsutveckling och glädje.
                        </p>
                    </SectionCard>
                </div>
            </MaxWidthWrapper>
            <div className="py-20 bg-custom_dark_red">

                <MaxWidthWrapper className='mb-10 text-white'>
                    <h1 className="text-3xl sm:text-4xl font-bold">Fotboll i skolan i Växjö</h1>
                    <p className="text-lg mt-2">
                        Verksamheten är anpassad och certifierad enligt Svenska Fotbollförbundets riktlinjer för Nationell Idrottsutbildning (NIU) samt Fotboll i grundskolan (årskurs 7-9).

                        Östers IF ansvarar för fotbollsutbildningen. Vid två till tre pass i veckan, beroende på ålder och val av utbildning, ges eleverna goda förutsättningar att träna och utvecklas inom sin idrott. Eleverna skolas i en elitförening som andas historik och framtid. Föreningen erbjuder eleverna bra träningsfaciliteter, både inom- och utomhus, i form av naturgräs, konstgräs och bra utrymmen för fysträning. Träningen genomförs tillsammans med behöriga och meriterade tränare.
                    </p>
                </MaxWidthWrapper>

                <MaxWidthWrapper>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {schools.map((school) => (

                            <Card
                                key={school.id}
                                className="relative h-[350px] rounded-lg shadow-md border border-gray-200 overflow-hidden"
                            >
                                <Image
                                    src={school.imageUrl}
                                    alt={school.name}
                                    fill
                                    className="object-cover"
                                    priority
                                />

                                <div className="absolute inset-0 bg-black/40 flex flex-col justify-between p-4">
                                    <div>
                                        <CardTitle className="text-xl font-semibold text-white">
                                            {school.name}
                                        </CardTitle>
                                        <CardDescription className="text-gray-200">
                                            {school.description}
                                        </CardDescription>
                                    </div>

                                    <Button
                                        asChild
                                        variant="red"
                                    >
                                        <Link href={`/fotboll-i-skolan/${school.slug}`}>Läs mer om {school.name}</Link>
                                    </Button>
                                </div>
                            </Card>


                        ))}
                    </div>
                </MaxWidthWrapper>
            </div >
        </main>
    );
}

// Reusable section card with optional image
function SectionCard({
    title,
    children,
    image,
}: {
    title: string;
    children: React.ReactNode;
    image?: { src: string; alt: string };
}) {
    return (
        <section className="bg-gray-50 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200">
            {image && (
                <div className="relative w-full h-56 mb-4 rounded-xl overflow-hidden">
                    <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        className="object-cover"
                    />
                </div>
            )}
            <h2 className="text-xl md:text-2xl font-semibold text-custom_red mb-3">{title}</h2>
            <div className="text-gray-800 text-base leading-relaxed">{children}</div>
        </section>
    );
}
