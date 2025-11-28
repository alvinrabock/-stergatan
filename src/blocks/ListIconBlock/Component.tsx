import React from 'react';
import { IconListBlock as IconListBlockType } from '@/types';
import { Media } from '@/app/components/Media/index';
import RichText from '@/app/components/RichText/index';

type Props = IconListBlockType;

export const IconListBlock: React.FC<Props> = ({ icons }) => {
  if (!icons?.length) return null;

  return (
    <div className="flex flex-row flex-wrap gap-x-10 gap-y-6">
      {icons.map((item, index) => {
        const icon =
          typeof item.icon === 'object' && item.icon !== null ? item.icon : null;

        return (
          <div
            key={item.id || index}
            className="flex flex-row items-center justify-start gap-2 text-left max-w-prose"
          >
            {icon && (
              <Media
                resource={icon}
                alt={icon.alt || ''}
                imgClassName="w-8 h-8 object-contain"
              />
            )}
            {item.content && <RichText data={item.content} enableGutter={false} />}
          </div>
        );
      })}
    </div>
  );
};
