import Link from 'next/link';
import Image from 'next/image';
import React from 'react';
import MaxWidthWrapper from '../components/MaxWidthWrapper';
import { Button } from '../components/ui/Button';
import { Card, CardDescription, CardTitle } from '../components/ui/card';


// Mock data for schools (replace with actual data from Payload CMS or an API)
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

const SchoolSelectionPage = () => {


    return (
        <div className="py-40 min-h-screen bg-custom_dark_red">

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
    );
};

export default SchoolSelectionPage;
