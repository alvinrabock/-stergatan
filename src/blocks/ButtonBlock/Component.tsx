import { Media } from '@/app/components/Media/index';
import { CMSLink } from '@/app/components/Link/index';

import type { ButtonBlock as ButtonBlockType } from '@/types'; 
export const ButtonBlock = ({
  link,
  icon,
}: ButtonBlockType) => {

    return (
        <div className="my-4">
            <CMSLink {...link}>
                {icon && (
                    <span className="w-5 inline-block">
                        <Media resource={icon} className="w-full h-full object-contain" />
                    </span>
                )}
            </CMSLink>
        </div>
    );
};
