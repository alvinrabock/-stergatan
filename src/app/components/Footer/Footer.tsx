import { fetchFooter } from '@/lib/apollo/fetchFooter/action';
import { fetchSinglePartnerniva } from '@/lib/apollo/fetchPartnernivaer/fetchSinglePartnernivaAction';
import { Footer as FooterType, Partner, Partnernivaer } from '@/types';
import React from 'react';
import Facebook from '../Icons/Facebook';
import Instagram from '../Icons/Instagram';
import TikTok from '../Icons/TikTok';
import MaxWidthWrapper from '../MaxWidthWrapper';
import { Media } from '../Media/index';
import Link from "next/link";
import YoutubeIcon from '../Icons/YoutubeIcon';
import XIcon from '../Icons/XIcon';
import Image from 'node_modules/next/image';

const Footer = async () => {
  const partnerData: Partnernivaer | null = await fetchSinglePartnerniva("huvudpartner");
  const footerData: FooterType = await fetchFooter();

  if (!partnerData?.koppladepartners?.docs || !Array.isArray(partnerData.koppladepartners.docs)) {
    return null;
  }

  return (
    <footer className="w-full bg-custom_dark_dark_red">
      <MaxWidthWrapper>
        {/* Partners */}
        <ul className="flex flex-wrap justify-center items-center gap-6 py-4 px-4 sm:px-6 lg:px-8">
          {partnerData.koppladepartners.docs
            .filter((partner): partner is Partner => typeof partner !== "string")
            .map((partner) => (
              <li key={partner.id} className="flex justify-between w-24 sm:w-32 lg:w-40 flex-shrink-0">
                <div className="relative h-12 w-full"> {/* Adjust height as needed, width will be 100% of parent li */}
                  {partner.link ? (
                    <Link
                      href={partner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full h-full relative"
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
            ))}
        </ul>

        {/* Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 border-t py-10">
          {/* Logo Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">

              <Image
                src="/oster-vit-logotype.png"
                alt="Öster logo"
                width={102}
                height={402}
                className="object-contain"
              />

            </div>

          </div>

          {/* Download App Section */}
          <div className="space-y-4 text-white">
            <h3 className="font-semibold text-lg text-white">App</h3>
            <p className="text-sm">I vår app finns nyheter om allt från Östers IF. Se highlights, tabeller, truppen och mycket mer!</p>
            <div className="space-y-3 flex flex-row flex-wrap gap-4">
              <Link target="_blank" href="https://apps.apple.com/se/app/%C3%B6sters-if-live/id1219207321?l=en-GB">
                <Image
                  src="/Download_on_the_App_Store_Badge_SE_RGB_blk_100317.svg"
                  alt="App Store"
                  width={110}
                  height={50}
                />
              </Link>
              <Link target="_blank" href="https://play.google.com/store/apps/details?id=com.connectedleague.club.osters&pcampaignid=web_share">
                <Image
                  src="/ladda-ned-google-play.svg"
                  alt="Google Play"
                  width={120}
                  height={50}
                />
              </Link>
            </div>
          </div>

          {/* Address Section */}
          <div className="space-y-4 text-white">
            <h3 className="font-semibold text-lg text-white">Adress</h3>
            <p className="text-sm">
              Spiris Arena<br />
              Bollgatan 9<br />
              352 27 Växjö
            </p>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-4 text-white">
            <h3 className="font-semibold text-lg text-white">Kontakta oss</h3>
            <div className="space-y-3 text-sm">
              <div>
                <div className="font-medium text-white">Telefon</div>
                <Link href="tel:0470-731200" className="hover:text-white">
                  0470 - 73 12 00
                </Link>
              </div>
              <div>
                <div className="font-medium text-white">E-post</div>
                <Link href="mailto:info@ostersif.se" className="hover:text-white">
                  info@ostersif.se
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Social Media */}
        <div className="py-4 flex flex-col gap-8 justify-center items-center">
          <div className="flex space-x-4">
            {footerData.socialMedia?.map((social) => (
              social?.url && social?.platform && (
                <Link
                  key={social.id || social.platform}
                  href={social.url}
                  className="text-gray-400 hover:text-white bg-custom_dark_red p-3 rounded-full"
                >
                  {social.platform === 'Facebook' && <Facebook className="h-6 w-6 fill-white" />}
                  {social.platform === 'Instagram' && <Instagram className="h-6 w-6 fill-white" />}
                  {social.platform === 'TikTok' && <TikTok className="h-6 w-6 fill-white" />}
                  {social.platform === 'Youtube' && <YoutubeIcon className="h-6 w-6 fill-white" />}
                  {social.platform === 'X' && <XIcon className="h-6 w-6 fill-white" />}
                  <span className="sr-only">{social.platform}</span>
                </Link>
              )
            ))}
          </div>
        </div>

      </MaxWidthWrapper>
    </footer>
  );
};

export default Footer;
