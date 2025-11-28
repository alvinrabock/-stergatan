import Image from "next/image";

interface Player {
  title: string;
  image?: string | null;
  number?: string | null;
  position?: string | null;
  land?: string | null;
  utlanad?: boolean;
  kommentar?: string | null;
}

const fallbackImageUrl = "/1496042.webp";

export const PlayerCardCMS = ({ person }: { person: Player }) => (
  <div className="relative bg-custom_dark_red rounded-2xl overflow-hidden group aspect-[4/5] bg-cover bg-center flex flex-col justify-end">
    {/* Background Image */}
    <div className="absolute inset-0 w-full h-full z-0">
      {person.image ? (
        <img
          src={person.image}
          alt={person.title}
          className="object-cover object-top w-full h-full"
          loading="lazy"
        />
      ) : (
        <div className="relative w-full h-full">
          <Image
            src={fallbackImageUrl}
            alt={`${person.title} (fallback)`}
            fill
            className="object-cover object-top"
            loading="lazy"
          />
        </div>
      )}
    </div>

    {/* Gradient overlay */}
    <div className="absolute inset-0 z-10 bg-gradient-to-t from-custom_dark_blue via-custom_dark_blue/30 to-transparent" />

    {/* Shirt Number */}
    {person.number && (
      <span className="absolute top-4 left-4 z-20 font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-custom-red">
        {person.number}
      </span>
    )}

    {/* Loan status */}
    {person.utlanad && (
      <div className="absolute top-2 right-2 bg-yellow-500 text-black text-xs font-semibold px-2 py-1 rounded-md z-20 shadow max-w-[70%] truncate">
        {person.kommentar}
      </div>
    )}

    {/* Player details */}
    <div className="relative z-20 p-4 text-white space-y-1">
      <h2 className="text-lg font-bold md:text-xl lg:text-2xl">{person.title}</h2>

      <div className="text-xs sm:text-sm space-y-0.5 flex flex-wrap gap-4">
        {person.position && <p>{person.position}</p>}
        {person.land && <p>{person.land}</p>}
      </div>
    </div>
  </div>
);