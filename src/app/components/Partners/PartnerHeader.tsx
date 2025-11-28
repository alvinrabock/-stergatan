import { Partner, Partnernivaer } from "@/types";
import Link from "node_modules/next/link";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { Media } from "../Media/index";

// The component accepts partnerData as a prop, which is fetched server-side.
const PartnerHeader = ({ partnerData }: { partnerData: Partnernivaer | null }) => {
    if (!partnerData) {
        return <div>Partner data not found.</div>;
    }

    return (
        <ul className="flex justify-between items-center gap-6 bg-custom_dark_red sticky top-0 z-40 overflow-hidden">
            <MaxWidthWrapper className="flex justify-between items-center gap-6 py-2">

                {partnerData.koppladepartners?.docs && partnerData.koppladepartners.docs.length > 0 ? (
                    partnerData.koppladepartners.docs
                        .filter((partner): partner is Partner => typeof partner !== 'string')
                        .map((partner) => (
                            <li key={partner.id} className="flex justify-center items-center">
                                <div className="relative h-2 w-12 sm:w-16 sm:h-6">
                                    {partner.link ? (
                                        <Link
                                            href={partner.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block w-full h-full relative "
                                        >
                                            <Media
                                                resource={partner.logotype || undefined}
                                                alt={partner.title}
                                                fill
                                                imgClassName="object-contain"
                                            />
                                        </Link>
                                    ) : (
                                        <Media
                                            resource={partner.logotype || undefined}
                                            alt={partner.title}
                                            fill
                                            imgClassName="object-contain"
                                        />
                                    )}
                                </div>
                            </li>
                        ))
                ) : (
                    <li>No partners found.</li>
                )}
            </MaxWidthWrapper>

        </ul>
    );
};

export default PartnerHeader;
