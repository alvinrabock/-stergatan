"use client";

import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { Bell, Ticket, Play, Calendar, Trophy } from "lucide-react";
import { Lag, MatchCardData } from "@/types";
import { getMatches } from "@/lib/fetchMatches";
import { fetchTeamsWithSMC } from "@/lib/apollo/fetchTeam/fetchTeamForMatchesAction";
import MiniMatchCard from "@/app/components/Match/MiniMatchCard";
import Link from "next/link";
import Image from "next/image";
import type { Swiper as SwiperType } from 'swiper';
import MiniMatchCardSkeleton from "@/app/components/Skeletons/MiniMatchCardSkeleton";

export default function SpeladeMatcherBlock() {
    const [matches, setMatches] = useState<MatchCardData[]>([]);
    const [teamsWithSEF, setTeamsWithSEF] = useState<Lag[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Refs for navigation
    const prevRef = useRef<HTMLButtonElement>(null);
    const nextRef = useRef<HTMLButtonElement>(null);
    const [swiperReady, setSwiperReady] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const fetchedTeams = await fetchTeamsWithSMC();

                if (!fetchedTeams || fetchedTeams.length === 0) {
                    setError("Inga SEF-lag hittades.");
                    setMatches([]);
                    return;
                }

                setTeamsWithSEF(fetchedTeams);

                const leagueIdsSet = new Set<number>();
                fetchedTeams.forEach((team: Lag) => {
                    team.seasons?.forEach((season) => {
                        season.tournaments?.forEach((tournament) => {
                            const leagueId = tournament.leagueId;
                            if (leagueId) {
                                leagueIdsSet.add(Number(leagueId));
                            }
                        });
                    });
                });

                const leagueIds = Array.from(leagueIdsSet).map(String);
                const smcTeamId = fetchedTeams[0]?.smcTeamId;

                if (!smcTeamId) {
                    setError("Ogiltigt smcTeamId.");
                    setMatches([]);
                    return;
                }

                const homeTeamId = smcTeamId;
                const awayTeamId = smcTeamId;

                const data = await getMatches(leagueIds, homeTeamId, awayTeamId);

                const filteredMatches = data
                    .filter((match) => match.status === "Over")
                    .sort(
                        (a, b) =>
                            new Date(b.kickoff).getTime() - new Date(a.kickoff).getTime()
                    );

                setMatches(filteredMatches);
                setSwiperReady(true); // trigger Swiper render after buttons are mounted
            } catch (err) {
                console.error("Error fetching played matches:", err);
                setError("Kunde inte ladda matcher.");
                setMatches([]);
            }
        }

        fetchData();
    }, []);

    return (
        <div className="bg-custom_dark_dark_red flex flex-col gap-4 p-6 w-full py-2 relative">
            <h2 className="text-4xl font-bold mb-8 text-left text-white">
                Senast spelade matcher
            </h2>
            <div className="relative overflow-visible">
                {/* Custom Navigation Buttons */}
                <button
                    ref={prevRef}
                    className="swiper-played-button-prev absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md disabled:opacity-0"
                    aria-label="Föregående"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-700" />
                </button>

                <button
                    ref={nextRef}
                    className="swiper-played-button-next absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white/80 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md disabled:opacity-0"
                    aria-label="Nästa"
                >
                    <ArrowRight className="w-5 h-5 text-gray-700" />
                </button>

                {matches.length === 0 && !error ? (
                    <div className="flex flex-row flex-nowrap gap-10">
                        {[...Array(4)].map((_, i) => (
                            <MiniMatchCardSkeleton key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="bg-red-500 text-white p-4 rounded-md text-center">
                        {error}
                    </div>
                ) : swiperReady ? (
                    <Swiper
                        modules={[Navigation]}
                        spaceBetween={16}
                        slidesPerView={1.2}
                        navigation={{
                            nextEl: nextRef.current,
                            prevEl: prevRef.current,
                        }}
                        onBeforeInit={(swiper: SwiperType) => {
                            if (
                                swiper.params.navigation &&
                                typeof swiper.params.navigation !== 'boolean'
                            ) {
                                swiper.params.navigation.prevEl = prevRef.current;
                                swiper.params.navigation.nextEl = nextRef.current;
                            }
                        }}

                        breakpoints={{
                            1224: { slidesPerView: 4 },
                            768: { slidesPerView: 3.5 },
                            500: { slidesPerView: 2.3 },
                            450: { slidesPerView: 2.3 },
                        }}
                    >
                        {matches.slice(0, 8).map((match) => (
                            <SwiperSlide key={match.matchId}>
                                <MiniMatchCard
                                    match={match}
                                    colorTheme="outline"
                                    teamsWithSEF={teamsWithSEF ?? undefined}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : null}
            </div>

            <section className="w-full py-12 md:py-24 text-white">

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text + Features */}
                    <div className="flex flex-col justify-center space-y-6">
                        <div className="space-y-4">
                            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                                Allt du behöver för att följa klubben
                            </h2>
                            <p className="max-w-[600px] text-white/70 md:text-xl">
                                Få den ultimata fotbollsupplevelsen direkt i din telefon. Följ alla
                                matchhändelser, få exklusiva nyheter och ha din biljett alltid tillgänglig.
                            </p>
                        </div>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                {
                                    icon: <Bell className="h-5 w-5" />,
                                    title: 'Pushnotiser',
                                    desc: 'Få de senaste nyheterna om klubben direkt till din telefon',
                                },
                                {
                                    icon: <Ticket className="h-5 w-5" />,
                                    title: 'Digital biljett',
                                    desc: 'Scanna din biljett direkt från appen när du kommer till arenan',
                                },
                                {
                                    icon: <Trophy className="h-5 w-5" />,
                                    title: 'Live-uppdateringar',
                                    desc: 'Följ alla matchhändelser i Allsvenskan i realtid med pushnotiser',
                                },
                                {
                                    icon: <Play className="h-5 w-5" />,
                                    title: 'Matchvideor',
                                    desc: 'Se videohöjdpunkter från alla händelser efter omgången är färdigspelad',
                                },
                                {
                                    icon: <Calendar className="h-5 w-5" />,
                                    title: 'Schema & Tabell',
                                    desc: 'Komplett spelschema, tabellställning och truppinformation',
                                },
                            ].map(({ icon, title, desc }) => (
                                <div key={title} className="flex items-start gap-3">
                                    <div className="flex h-8 w-8 p-2 items-center justify-center rounded-lg bg-custom_red">
                                        {icon}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold">{title}</h3>
                                        <p className="text-sm text-white/70">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* App Buttons */}
                        <div className="flex flex-wrap gap-4 pt-4">
                            <Link
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://apps.apple.com/se/app/%C3%B6sters-if-live/id1219207321?l=en-GB"
                            >
                                <Image
                                    src="/Download_on_the_App_Store_Badge_SE_RGB_blk_100317.svg"
                                    alt="App Store"
                                    width={140}
                                    height={50}
                                />
                            </Link>
                            <Link
                                target="_blank"
                                rel="noopener noreferrer"
                                href="https://play.google.com/store/apps/details?id=com.connectedleague.club.osters&pcampaignid=web_share"
                            >
                                <Image
                                    src="/ladda-ned-google-play.svg"
                                    alt="Google Play"
                                    width={150}
                                    height={50}
                                />
                            </Link>
                        </div>
                    </div>

                    {/* Image */}
                    <div className="flex justify-center lg:justify-end">
                        <Image
                            src="/oster-app.png"
                            width={1080}
                            height={1920}
                            alt="Fotbollsapp på telefon"
                            className="object-contain"
                        />
                    </div>
                </div>

            </section>
        </div>
    );
}
