'use client';

import React from 'react';
import { Menu, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
  SheetDescription,
} from '../ui/sheet';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../ui/accordion';
import { Media } from '../Media/index';
import Facebook from '../Icons/Facebook';
import Instagram from '../Icons/Instagram';
import TikTok from '../Icons/TikTok';
import YoutubeIcon from '../Icons/YoutubeIcon';
import XIcon from '../Icons/XIcon';
import { Button } from '../ui/Button';
import type { Media as MediaType } from '@/types';
import { SearchDialog } from './SearchDialog';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface FrontspaceMenuItem {
  id: string;
  title: string;
  link_type: string;
  url?: string;
  slug?: string;
  page_id?: string;
  target?: string;
  image?: string | number | any;
  children?: FrontspaceMenuItem[];
}

interface SocialMedia {
  id: string;
  platform: string;
  url: string;
}

interface MobileNavProps {
  menuItems: FrontspaceMenuItem[];
  socialMedia: SocialMedia[];
}

export function MobileNav({ menuItems, socialMedia }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Helper function to get href from Frontspace menu item
  const getLinkHref = (item: FrontspaceMenuItem): string => {
    // External links
    if (item.link_type === 'external' && item.url) {
      return item.url;
    }

    // Internal pages - use the url field which contains the full nested path
    if (item.link_type === 'internal' && item.url) {
      return item.url; // Already has full path like /partners/vara-partners
    }

    // Fallback
    return '#';
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const getLinkProps = (item: FrontspaceMenuItem) =>
    item.target === '_blank'
      ? { target: '_blank', rel: 'noopener noreferrer' }
      : {};

  const renderSubMenu = (
    subMenu: FrontspaceMenuItem[] | null | undefined,
    isTopLevel = true
  ): React.ReactNode => {
    if (!subMenu) return null;
    return (
      <ul className={isTopLevel
        ? 'flex flex-col gap-3 sm:gap-4 p-3 sm:p-4'
        : 'ml-3 sm:ml-4 pl-2 sm:pl-3 mt-2 space-y-2'}
      >
        {subMenu?.map((item) => {
          const hasSubMenu = item.children && item.children.length > 0;
          const href = getLinkHref(item);

          return (
            <li key={item.id || item.title} className="relative w-full">
              {/* Check if item has image - if so, render as box layout */}
              {false ? ( // TODO: Add image support if needed
                <div className='relative grow rounded-lg overflow-hidden group h-48 sm:h-60 w-full'>
                  <Media
                    resource={item.image as string | number | MediaType}
                    imgClassName='absolute inset-0 object-cover w-full h-full'
                    fill
                    size='30vw'
                  />
                  <SheetClose asChild>
                    <Link
                      href={href}
                      {...getLinkProps(item)}
                      className='absolute inset-0 flex items-end p-3 sm:p-4 transition bg-gradient-to-t from-custom_dark_red/80 via-custom_dark_red/40 to-transparent'
                    >
                      <div className='flex items-center gap-2 text-white text-lg sm:text-xl md:text-2xl font-semibold'>
                        {item.title}
                        <ArrowRight className='w-5 h-5' />
                      </div>
                    </Link>
                  </SheetClose>
                </div>
              ) : hasSubMenu ? (
                <Accordion type="single" collapsible className="space-y-3 text-white p-0">
                  <AccordionItem value={item.title}>
                    <AccordionTrigger className="text-left font-semibold text-sm sm:text-base p-0">
                      {item.title}
                    </AccordionTrigger>
                    <AccordionContent>
                      {renderSubMenu(item.children, false)}
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ) : (
                <SheetClose asChild>
                  <Link
                    href={href}
                    {...getLinkProps(item)}
                    className={`block ${isTopLevel ? 'text-sm sm:text-base' : 'font-semibold text-xs sm:text-sm'} text-white`}
                  >
                    {item.title}
                  </Link>
                </SheetClose>
              )}
            </li>
          );
        })}
      </ul>
    );
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          className="text-white relative -m-2 inline-flex items-center justify-center rounded-md p-2 gap-1"
        >
          Meny
          <Menu className="h-8 w-8" aria-hidden="true" />
        </button>
      </SheetTrigger>

      <SheetContent className='!max-w-[95vw] sm:!max-w-[500px] md:!max-w-[600px] lg:!max-w-[700px] border-none overflow-y-auto p-4 sm:p-6 bg-custom_dark_red'>
        <SheetHeader className='flex flex-row justify-between items-center w-full p-0'>
          <div className='sr-only'>
            <SheetTitle className='sr-only text-left mb-4'>Meny</SheetTitle>
            <SheetDescription className='sr-only'>
              Välj vilken sida du vill navigera till
            </SheetDescription>
          </div>

          <SearchDialog />

          <SheetClose asChild>
            <Button variant="ghost" aria-label='Close menu' className='text-white text-lg'>
              Stäng
              <X className='w-6 h-6' />
            </Button>
          </SheetClose>
        </SheetHeader>

        <div className='flex flex-col justify-between items-between min-h-[92svh]'>
          <div>
            <Accordion type="single" collapsible className="space-y-5 [&_*]:!rounded-none">
              {menuItems?.map((menuItem) => {
                const textSizeClass = 'text-lg sm:text-xl md:text-2xl';
                const borderClass = 'border-b border-white/20';
                const spacingClass = 'mb-5';
                const paddingClass = 'p-3';

                if (menuItem.children && menuItem.children.length > 0) {
                  return (
                    <AccordionItem
                      key={menuItem.id}
                      value={menuItem.title}
                      className={`border-none ${spacingClass}`}
                    >
                      <AccordionTrigger className={`${paddingClass} oswald-font uppercase text-white font-bold ${textSizeClass} ${borderClass} flex justify-between items-center group`}>
                        {menuItem.title}
                      </AccordionTrigger>
                      <AccordionContent>
                        {renderSubMenu(menuItem.children, true)}
                      </AccordionContent>
                    </AccordionItem>
                  );
                }

                const href = getLinkHref(menuItem);

                return (
                  <div key={menuItem.id} className={spacingClass}>
                    <SheetClose asChild>
                      <Link
                        href={href}
                        {...getLinkProps(menuItem)}
                        className={`block w-full text-left ${textSizeClass} text-white ${borderClass} ${paddingClass} oswald-font font-bold uppercase`}
                      >
                        {menuItem.title}
                      </Link>
                    </SheetClose>
                  </div>
                );
              })}
            </Accordion>
          </div>

          <div className='flex flex-row flex-wrap w-full max-w-full gap-3 sm:gap-4 mt-8 sm:mt-10 pb-4 sm:pb-6'>
            {socialMedia
              ?.filter((social) => typeof social.url === 'string')
              .map((social) => (
                <Link
                  key={social.id}
                  href={social.url!}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='text-gray-400 hover:text-white bg-custom_red p-2 sm:p-3 rounded-full'
                >
                  {social.platform === 'Facebook' ? (
                    <Facebook className='h-4 w-4 fill-white' />
                  ) : social.platform === 'Instagram' ? (
                    <Instagram className='h-4 w-4 fill-white' />
                  ) : social.platform === 'TikTok' ? (
                    <TikTok className='h-4 w-4 fill-white' />
                  ) : social.platform === 'Youtube' ? (
                    <YoutubeIcon className='h-4 w-4 fill-white' />
                  ) : social.platform === 'X' ? (
                    <XIcon className='h-4 w-4 fill-white' />
                  ) : null}
                  <span className='sr-only'>{social.platform}</span>
                </Link>
              ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

export default MobileNav;