import React from 'react';
import Image from 'next/image';
import { Personal } from '@/types';

interface PersonalItemProps {
  person: Personal;
}

const PersonalItem: React.FC<PersonalItemProps> = ({ person }) => {
  // Extract photo URL - handle both string and object cases
  const photoUrl = typeof person.photo === 'string'
    ? person.photo
    : person.photo?.url;
  const photoAlt = typeof person.photo === 'object' && person.photo?.alt
    ? person.photo.alt
    : person.title;

  return (
    <div
      key={person.id}
      className="flex flex-row gap-4 w-full min-w-0 items-start"
    >
      <div className="relative w-24 aspect-[4/5] rounded-md overflow-hidden flex-shrink-0">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={photoAlt}
            fill
            sizes="(max-width: 640px) 96px, (max-width: 768px) 33vw, (max-width: 1200px) 25vw, 15vw"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-custom_red flex items-center justify-center">
            <Image
              src="/oster-vit-logotype.png"
              alt="Östers IF Logotype"
              width={60}
              height={40}
              className="object-contain"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col justify-start gap-1 flex-1 min-w-0 overflow-hidden">
        {/* Dynamic font sizing based on container width */}
        <h4 
          className="font-semibold text-white"
          style={{ fontSize: 'clamp(0.875rem, 4cqw, 1.125rem)' }}
        >
          {person.title}
        </h4>
        
        <p 
          className="text-white/70"
          style={{ fontSize: 'clamp(0.625rem, 3cqw, 0.875rem)' }}
        >
          {person.jobTitle}
        </p>
      
        <a
          href={`mailto:${person.email}`}
          className="text-white/60 underline hover:text-white/80 transition-colors"
          style={{ fontSize: 'clamp(0.625rem, 3cqw, 0.875rem)' }}
        >
          {person.email}
        </a>

        {person.phoneNumber && (
          <a
            href={`tel:${person.phoneNumber}`}
            className="text-white/60 underline hover:text-white/80 transition-colors"
            style={{ fontSize: 'clamp(0.625rem, 3cqw, 0.875rem)' }}
          >
            {person.phoneNumber}
          </a>
        )}
      </div>
    </div>
  );
};
export default PersonalItem;