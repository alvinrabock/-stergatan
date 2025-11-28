import MaxWidthWrapper from '@/app/components/MaxWidthWrapper';
import { Button } from '@/app/components/ui/Button';
import Image from 'next/image';
import React from 'react';


// Mock data (replace with actual data from Payload CMS)
const pageData = {
    title: "ProCivitas Privata Gymnasium - Idrottsutbildning i Växjö",
    slug: "procivitas-privata-gymnasium",
    hero: {
        title: "Din väg till elitidrott och högskolestudier",
        image: {
            url: "/images/procivitas-arena.jpg", // Replace with your actual image path
            alt: "ProCivitas Privata Gymnasium vid Arenastaden i Växjö"
        },
        overlay: true
    },
    sections: [
        {
            layout: "richtext",
            content: "<p>ProCivitas i Växjö har sedan 2003 erbjudit en unik utbildningsmiljö för elever som vill kombinera en högkvalitativ gymnasieutbildning med seriös idrottssatsning. Vi erbjuder en helhetslösning för dig som drömmer om att utvecklas optimalt inom din idrott samtidigt som du får en bred behörighet för vidare studier.</p><p>Vårt programutbud inkluderar <a href=\"#samhalls\">Samhällsvetenskapsprogrammet</a>, <a href=\"#ekonomi\">Ekonomiprogrammet</a> och <a href=\"#naturvetenskap\">Naturvetenskapsprogrammet</a>. På skolan går cirka 400 elever, varav ett hundratal är aktiva idrottare som redan skördat stora framgångar både nationellt och internationellt.</p>",
        },
        {
            layout: "richtext",
            title: "Fokus på din utveckling som idrottare och student",
            content: "<p>På ProCivitas är utbildningen skräddarsydd för dig som helhjärtat vill satsa på din idrott utan att kompromissa med en gedigen gymnasieutbildning. Vårt upplägg ger dig både praktisk och teoretisk kunskap inom din idrott, vilket skapar de bästa förutsättningarna för att nå elitnivå samtidigt som du blir väl förberedd för universitet och högskola.</p><p>När vi väljer samarbetspartners prioriterar vi väl etablerade och välfungerande klubbar med goda träningsfaciliteter, meriterade och högutbildade tränare som ofta själva har erfarenhet från elitnivå. Vårt nära samarbete med Östers IF inom fotboll är ett utmärkt exempel på detta.</p>"
        },
        {
            layout: "richtext",
            title: "Optimala träningsförutsättningar i Arenastaden",
            content: "<p>Som idrottselev hos oss får du de bästa förutsättningarna med erfarna och välutbildade tränare från Östers IF. Träningen sker under dagtid, vilket ger dig optimal återhämtning inför eventuella kvällspass med din klubb. Våra moderna träningsanläggningar i Arenastaden inkluderar en konstgräsplan, flera naturgräsplaner (däribland Myresjöhus Arena) samt Tipshallen, en av Sveriges få fullskaliga inomhushallar med konstgräs.</p>"
        },
        {
            layout: "richtext",
            title: "En trygg och inspirerande skolmiljö",
            content: "<p>Skolan är centralt belägen på Söder i Växjö, i närheten av natursköna områden som Strandbjörket och Växjösjön. Vi har en egen restaurang som serverar frukost, lunch och middag, vilket underlättar din vardag. Med cykel tar du dig snabbt till Arenastaden.</p><p>Vi erbjuder även omfattande elevvård med skolsköterska, kurator, skolläkare och studievägledning för att säkerställa ditt välmående och din studieframgång.</p><p>Vårt välfungerande intranät gör att du enkelt når alla läxor och uppgifter online. Våra engagerade lärare stöttar dig och tydliggör vad som behöver göras för att du ska lyckas med dina studier.</p>"
        },
        {
            layout: "richtext",
            title: "Nationell Godkänd Idrottsutbildning (NIU) inom Fotboll",
            content: "<p>Vårt samarbete med Östers IF, Smålands Fotbollförbund och Svenska Fotbollförbundet är starkt och väl etablerat. Tillsammans med Östers IF är ProCivitas Privata Gymnasium certifierade av Svenska Fotbollsförbundet och godkända av Skolverket för att bedriva Nationell Idrottsutbildning (NIU) inom fotboll. Vi följer Svenska FF:s riktlinjer för Elitfotbollsgymnasium.</p><p>NIU-programmet är utformat för ambitiösa fotbollsspelare som söker optimala förutsättningar för elitförberedande träning i kombination med en seriös gymnasieutbildning.</p><p>Vi erbjuder 15 studieplatser för NIU-fotboll. Våra NIU-elever tränar antingen med sin moderklubb eller erbjuds träning med Östers IF:s U17/U19-lag.</p>"
        },
        {
            layout: "richtext",
            title: "Elevrekryteringsprocessen",
            content: "<p>Vi arrangerar Öppet hus två till tre gånger per läsår för att välkomna intresserade elever och föräldrar. Utöver dessa tillfällen tar vi alltid emot besök och ger dig möjligheten att följa undervisningen under en eller flera dagar.</p><p>Östers IF bedriver en aktiv scoutingverksamhet för ungdomar från 13 års ålder i enlighet med sina utbildningsplaner. Klubben anordnar även regelbundna talangträningar för ungdomar från omkringliggande föreningar i Småland, Blekinge och norra Skåne.</p><p>Våra föreningsrepresentanter bevakar distriktslagssamlingar, Elitpojk- och Elitflickläger samt följer spelare i turneringar som Cup Byggnads och Cup Kommunal (SM för distriktslag). Vi har en kontinuerlig dialog med Spelarutbildare (SU), Distriktsförbundskaptener (DFK) och Svenska Fotbollförbundets Förbundskaptener för att ge feedback och rapportera om spelarnas utveckling.</p><p>Varje år arrangerar Östers IF uttagningsdagar där sökande till vårt NIU-program inom fotboll bjuds in.</p>"
        },
        {
            layout: "richtext",
            title: "Organisation av gymnasieutbildningen och fotbollsträningen",
            content: "<p>Fotbollsträningen för NIU-elever är schemalagd på tre förmiddagar (måndag, onsdag och fredag) mellan kl. 10.00 och 11.30. Detta ger dig som idrottare bästa möjliga återhämtning inför eventuella kvällspass med din klubb.</p><p>Torsdagar är klubblagen lediga från träning, vilket ger utrymme för en längre skoldag och en träningsfri dag.</p><p>Vår flexibla schemaläggning tar hänsyn till dina träningstider i föreningen, tack vare ett väl utvecklat samarbete mellan skola och klubb. Vi har en stor lärarförståelse för våra idrottselever, som utgör cirka 25% av skolans totala elevantal.</p><p>Vi erbjuder extra stöd för planering och struktur i din vardag som idrottare samt stödundervisning i ämnen som matematik i mindre grupper. Om stödundervisningen krockar med ett eftermiddagspass prioriteras undervisningen.</p><p>Skolan erbjuder frukost och lunch till alla elever, och idrottseleverna har möjlighet att ta med sig en matlåda för att äta efter träningen.</p><nVi har regelbundna möten mellan skolansvarig från Östers IF och ansvarig från skolan för att kontinuerligt hantera elevfrågor. Skolansvarige deltar även vid skolans Öppet Hus.</p>"
        },
        {
            layout: "richtext",
            title: "Lokal Idrottsutbildning (LIU) inom Fotboll",
            content: "<p>Utöver NIU har Östers IF och ProCivitas möjlighet att erbjuda Lokal Idrottsutbildning (LIU) för ytterligare cirka 8-10 fotbollsspelare. Inom LIU följer du kursplanen för Idrott & Hälsa 1 & 2 Specialisering.</p><p>LIU-eleverna tränar fotboll två gånger i veckan, måndagar och onsdagar mellan kl. 10.00 och 11.30, och vi strävar efter att ge dem så likvärdiga förutsättningar för den praktiska fotbollsutbildningen som möjligt jämfört med NIU.</p>"
        },
        {
            layout: "richtext",
            title: "Våra Fotbolls- och Fysinstruktörer",
            content: "<p>Samtliga våra instruktörer är anställda av Östers IF och en del av deras tjänstgöring innefattar medverkan i vår skolverksamhet. Våra instruktörer har olika roller inom föreningens olika lag och arbetsuppgifter:</p><ul><li>Andreas Sandberg - Instruktör</li></ul><p>(Ytterligare instruktörer och deras roller kan läggas till här)</p>"
        },
        {
            layout: "cta",
            content: "Är du redo att ta nästa steg i din idrottskarriär och samtidigt få en utmärkt gymnasieutbildning? Kontakta oss idag för mer information eller besök vårt nästa Öppet Hus!",
            button: {
                label: "Kontakta oss",
                link: "/kontakt" // Replace with your actual contact page URL
            }
        }
    ]
};

const ProCivitasPage = () => {
    return (
        <div className="bg-gray-50">
            {/* Hero Section */}
            <header className="relative">
                {pageData.hero.image && (
                    <Image
                        src={pageData.hero.image.url}
                        alt={pageData.hero.image.alt}
                        className="w-full h-[400px] object-cover" // Adjust height as needed
                    />
                )}
                {pageData.hero.overlay && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <h1
                            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white text-center p-4 max-w-3xl"
                        >
                            {pageData.hero.title}
                        </h1>
                    </div>
                )}
            </header>

            {/* Main Content */}
            <main className='w-full py-20'>
                <MaxWidthWrapper>
                    {pageData.sections.map((section, index) => {
                        if (section.layout === "richtext") {
                            return (
                                <section key={index} className="mb-8 md:mb-12">
                                    <div>
                                        {section.title && <h2 className="text-2xl font-semibold mb-4 text-blue-700">{section.title}</h2>}
                                        <div dangerouslySetInnerHTML={{ __html: section.content }} />
                                    </div>
                                    {/* Add smooth scrolling to internal links */}
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
                                <section key={index} className="bg-gray-100 rounded-lg p-6 md:p-8 mb-8 md:mb-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md">
                                    <div className="prose prose-sm sm:prose lg:prose-lg xl:prose-xl">
                                        {section.content}
                                    </div>
                                    <Button
                                        asChild // Use asChild to wrap the anchor tag
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-full transition-colors duration-300"
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

export default ProCivitasPage;

