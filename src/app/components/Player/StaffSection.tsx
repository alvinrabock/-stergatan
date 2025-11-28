import Image from "next/image";

interface StaffMember {
  name: string;
  role?: string;
  image?: string | null;
  epost?: string | null;
  telefon?: string | null;
}

export const StaffSection = ({ staff }: { staff: StaffMember[] }) => (
  <aside className="col-span-1">
    <h2 className="text-white text-3xl font-bold mb-6">Ledarstab</h2>
    <div className="flex flex-col gap-6">
      {staff.map((person, index) => (
        <div key={index} className="flex text-white rounded-2xl overflow-hidden group">
          {person.image ? (
            <div className="flex-shrink-0 w-20 h-20 relative rounded-full overflow-hidden">
              <img
                src={person.image}
                alt={person.name}
                className="object-cover object-top w-full h-full"
                loading="lazy"
              />
            </div>
          ) : (
            <div className="flex-shrink-0 w-20 h-20 relative rounded-full overflow-hidden bg-custom_red flex items-center justify-center">
              <Image
                src="/oster-vit-logotype.png"
                alt="Öster logo"
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
          )}
          <div className="flex flex-col justify-center p-4 flex-grow">
            <h2 className="text-lg font-bold">{person.name}</h2>
            <p className="text-xs sm:text-sm text-white/80">{person.role}</p>
            {(person.epost || person.telefon) && (
              <div className="flex flex-col gap-1 mt-2">
                {person.epost && (
                  <a
                    href={`mailto:${person.epost}`}
                    className="text-xs text-white/70 hover:text-white transition-colors"
                  >
                    {person.epost}
                  </a>
                )}
                {person.telefon && (
                  <a
                    href={`tel:${person.telefon}`}
                    className="text-xs text-white/70 hover:text-white transition-colors"
                  >
                    {person.telefon}
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  </aside>
);
