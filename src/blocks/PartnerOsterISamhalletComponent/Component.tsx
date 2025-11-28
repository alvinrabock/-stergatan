import Link from 'next/link'
import { Partner } from '@/types'
import { Media } from '@/app/components/Media/index'
import { fetchPartnersOsterISamhallet } from '@/lib/apollo/fetchPartners/fetchOsterISamhalletPartner'

const PartnerOsterISamhalletComponent = async () => {
  const partners: Partner[] = await fetchPartnersOsterISamhallet()

  if (!partners.length) return null

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-10 w-full">
      {partners.map((partner) => (
        <Link
          key={partner.id}
          href={partner.link || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center sm:justify-start"
        >
          {partner.logotype ? (
            <Media
              resource={partner.logotype}
              size="100vw"
              alt={partner.title}
              imgClassName="object-contain relative w-34 aspect-[3/2] flex items-center justify-center"
            />
          ) : (
            <span className="text-white/80 font-bold text-sm text-left">{partner.title}</span>
          )}
        </Link>
      ))}
    </div>
  )
}

export default PartnerOsterISamhalletComponent
