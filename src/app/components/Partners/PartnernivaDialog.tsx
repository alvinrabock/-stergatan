'use client';

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Button } from '@/app/components/ui/Button';
import Image from 'next/image';
import { Partnernivaer } from '@/types';
import { X } from 'lucide-react';
import Link from 'next/link';

interface PartnernivaDialogProps {
  partnernivaerData: Partnernivaer[];
}

const PartnernivaDialog = ({ partnernivaerData }: PartnernivaDialogProps) => {

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Visa Partnernivåer</Button>
      </DialogTrigger>
      <DialogContent className="w-full bg-custom_dark_dark_red text-white sm:max-w-md md:max-w-4xl min-h-[100svh] sm:min-h-[60svh] md:rounded-xl p-0 overflow-hidden flex flex-col max-h-[100svh] sm:max-h-[80svh]">
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6">

          <DialogHeader className='flex flex-row justify-between'>
            <div>
              <DialogTitle className="text-2xl pb-2 ">Partnernivåer</DialogTitle>
              <DialogDescription className="text-white/70">
                Här ser du nivåerna av partnerskap och vad som ingår.
              </DialogDescription>
            </div>

            <DialogClose asChild>
              <Button
                aria-label="Stäng"
                variant="ghost"
              >
                Stäng
                <X className="w-6 h-6" />
              </Button>
            </DialogClose>
          </DialogHeader>

          <Tabs defaultValue={partnernivaerData?.[0]?.id} className="mt-4 w-full">
            <TabsList className="w-full justify-start px-2 py-8 sm:p-8 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-white scrollbar-track-transparent bg-custom_dark_red gap-2">
              {partnernivaerData.map((nivå) => (
                <TabsTrigger
                  key={nivå.id}
                  value={nivå.id}
                  className="
                  transition-all duration-200 border-b-2 border-transparent
                  hover:bg-custom_red/20 rounded-xl
                  text-xs sm:text-[15px] text-center whitespace-nowrap px-4 py-2
                  shadow-none text-white font-bold
                  data-[state=active]:text-white
                  data-[state=active]:border-white
                  data-[state=active]:bg-transparent
                  data-[state=active]:shadow-none
                  data-[state=active]:rounded-none
                  flex items-center justify-center gap-2
                "
                >
                  {nivå.title}
                </TabsTrigger>
              ))}
            </TabsList>

            {partnernivaerData.map((nivå) => (
              <TabsContent key={nivå.id} value={nivå.id}>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold mb-1">{nivå.title}</h3>
                  <p className="text-md text-white/65 pb-2">
                    Investering: {nivå.investering}
                  </p>
                  {nivå.kortbeskrivning && (
                    <p className="text-white/80 mt-2">{nivå.kortbeskrivning}</p>
                  )}
                  <ul className="mt-4 space-y-4 border-t border-white/20 pt-4">
                    {nivå.Ingaripaketet?.map((punkt) => (
                      <li key={punkt.id} className="flex items-start gap-2">
                        <Image src="/oster-vit-logotype.png" alt={nivå.title} width={22} height={12} />
                        <span className="text-base leading-relaxed">{punkt.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

            ))}
          </Tabs>
        </div>

        <DialogFooter className="p-4">
          <Link href="/kontakt#marknad-och-forsaljning" className="w-full">
            <Button variant="outline" className='w-full'>
              Kontakta oss
            </Button>
          </Link>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PartnernivaDialog;
