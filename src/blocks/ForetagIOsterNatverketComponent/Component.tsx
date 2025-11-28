import Link from 'next/link'
import { Partner } from '@/types'
import { fetchPartnersInOsternatverket } from '@/lib/apollo/fetchPartners/fetchPartnerINatverk'
import { Media } from '@/app/components/Media/index'

const ForetagIOsterNatverketComponent = async () => {
  try {
    const partners: Partner[] = await fetchPartnersInOsternatverket()

    if (!partners?.length) return null

    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-10 w-full">
        {partners.map((partner) => (
          <Link
            key={partner.id}
            href={partner.link || '#'}
            target={partner.link ? "_blank" : "_self"}
            rel={partner.link ? "noopener noreferrer" : undefined}
            className="flex items-center justify-center sm:justify-start group transition-opacity hover:opacity-80"
            aria-label={`Visit ${partner.title}'s website`}
          >
            {partner.logotype ? (
              <Media
                resource={partner.logotype}
                size="100vw"
                alt={`${partner.title} logo`}
                imgClassName="object-contain relative w-32 aspect-[3/2] flex items-center justify-center"
              />
            ) : (
              <span className="text-white/80 font-bold text-sm text-left group-hover:text-white transition-colors">
                {partner.title}
              </span>
            )}
          </Link>
        ))}
      </div>
    )
  } catch (error) {
    console.error('Error fetching partners:', error)
    return null
  }
}

export default ForetagIOsterNatverketComponent