import React from 'react';
import MaxWidthWrapper from '@/app/components/MaxWidthWrapper';
import { Button } from '@/app/components/ui/Button';
import Image from 'next/image';

// Mock data (replace with actual data from Payload CMS or similar)
const prolympiaData = {
    title: "Prolympia Växjö - Din Idrottsskola",
    slug: "prolympia-vaxjo",
    hero: {
        title: "Kombinera din idrottssatsning med en stark utbildning",
        image: {
            url: "/images/prolympia-vaxjo-hero.jpg", // Replace with actual image URL
            alt: "Prolympia Växjö Arenastaden"
        },
        overlay: true
    },
    sections: [
        {
            layout: "richtext",
            content: "<p>Prolympia Växjö är en modern idrottsskola belägen i Arenastaden. Vi erbjuder en unik möjlighet för dig som vill kombinera din passion för idrott med en högkvalitativ utbildning. Hos oss får du de bästa förutsättningarna för att utvecklas både som idrottare och student.</p><p>Vi vänder oss till elever som drömmer om en framtid inom idrotten, och som samtidigt värdesätter en gedigen skolgång. Vår skola präglas av engagemang, gemenskap och en stark idrottsanda.</p>",
        },
        {
            layout: "richtext",
            title: "Våra kärnvärden",
            content: "<ul><li><strong>Hälsa:</strong> Vi främjar en sund livsstil och välbefinnande genom idrott och positiva relationer.</li><li><strong>Kunskap:</strong> Vi strävar efter att ge dig de verktyg du behöver för att lyckas med dina studier.</li><li><strong>Trygghet:</strong> Vi skapar en inkluderande och stöttande skolmiljö där du kan känna dig trygg.</li><li><strong>Idrott:</strong> Vi erbjuder en högkvalitativ idrottsutbildning i samarbete med lokala idrottsföreningar.</li></ul>",
        },
        {
            layout: "richtext",
            title: "Studera och träna i toppmoderna faciliteter",
            content: "<p>Prolympia Växjö erbjuder toppmoderna faciliteter för både studier och idrott. Vår placering i Arenastaden ger oss tillgång till utmärkta träningsmöjligheter, inklusive konstgräsplaner, inomhushallar och andra specialanpassade anläggningar.</p><p>Vi samarbetar nära med lokala idrottsföreningar för att säkerställa att du får den bästa möjliga träningen av kvalificerade tränare. Detta ger dig möjlighet att utvecklas inom din idrott samtidigt som du får en fullständig gymnasieutbildning.</p>",
        },
        {
            layout: "richtext",
            title: "En skola för framtiden",
            content: "<p>På Prolympia Växjö vill vi ge dig mer än bara en utbildning. Vi vill ge dig en grund för ett aktivt och hälsosamt liv, och verktygen för att nå dina drömmar, både inom idrotten och i framtiden.  Vi erbjuder en stark gemenskap, engagerade lärare och en studiemiljö som uppmuntrar till både personlig och akademisk utveckling.</p>",
        },
        {
            layout: "cta",
            content: "Är du redo att satsa på din idrott och din utbildning? Kontakta oss idag för att veta mer om Prolympia Växjö!",
            button: {
                label: "Kontakta oss",
                link: "/kontakt" // Replace with your actual contact page URL
            }
        }
    ]
};

const ProlympiaVaxjoPage = () => {
    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <header className="relative">
                {prolympiaData.hero.image && (
                    <Image
                        src={prolympiaData.hero.image.url}
                        alt={prolympiaData.hero.image.alt}
                        className="w-full h-[400px] object-cover bg-center"
                    />
                )}
                {prolympiaData.hero.overlay && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white text-center p-4 max-w-3xl drop-shadow-lg">
                            {prolympiaData.hero.title}
                        </h1>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className="w-full">
                <MaxWidthWrapper>
                    {prolympiaData.sections.map((section, index) => {
                        if (section.layout === "richtext") {
                            return (
                                <section key={index} className="mb-8 md:mb-12">
                                    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl mx-auto">
                                        {section.title && <h2 className="text-2xl font-semibold mb-4 text-green-600">{section.title}</h2>}
                                        <div dangerouslySetInnerHTML={{ __html: section.content }} />
                                    </div>
                                    <script
                                        dangerouslySetInnerHTML={{
                                            __html: `
                    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                      anchor.addEventListener('click', function (e) {
                        e.preventDefault();
                        document.querySelector(this.getAttribute('href')).scrollIntoView({
                          behavior: 'smooth'
                        });
                      });
                    });
                  `,
                                        }}
                                    />
                                </section>
                            );
                        } else if (section.layout === "cta") {
                            return (
                                <section key={index} className="bg-green-100 rounded-lg p-6 md:p-8 mb-8 md:mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-green-200">
                                    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl">
                                        {section.content}
                                    </div>
                                    <Button
                                        asChild
                                        className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-full transition-colors duration-300 shadow-md hover:shadow-lg"
                                    >
                                        <a href={section?.button?.link}>{section?.button?.label}</a>
                                    </Button>
                                </section>
                            );
                        }
                        return null;
                    })}
                </MaxWidthWrapper>
            </main>

        </div>
    );
};

export default ProlympiaVaxjoPage;
