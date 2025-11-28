'use client';

import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose, DialogTrigger, DialogHeader } from '../ui/dialog';

import { Personalavdelningar } from '@/types';
import { Button } from '../ui/Button';
import PersonalItem from '../Personal/PersonalItem';
import { X } from 'lucide-react';

interface ContactDialogProps {
    personalAvdelningData: Personalavdelningar;
}

const ContactDialog: React.FC<ContactDialogProps> = ({ personalAvdelningData }) => {
    return (
        <Dialog>
            <DialogTrigger>
                <Button variant="red">Jag är intresserad</Button>
            </DialogTrigger>
            <DialogContent className="w-full bg-custom_dark_dark_red text-white sm:max-w-md md:max-w-4xl min-h-[100svh] sm:min-h-[60svh] rounded-none md:rounded-xl p-6 overflow-hidden flex flex-col max-h-[100svh] sm:max-h-[80svh]">
                <DialogHeader className='flex flex-row justify-between'>
                    <div>
                        <DialogTitle className="text-left text-xl sm:text-2xl md:text-3xl font-semibold pr-8 sm:pr-10">
                            Vad kul att du funderar på att bli partner
                        </DialogTitle>
                        <DialogDescription className="text-left mt-3 sm:mt-4 mb-5 sm:mb-6 text-sm sm:text-base text-white/80">
                            Kontakta någon av oss så pratar vi mer om hur vi kan hjälpas åt som partners.
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

                <div className="flex-1 overflow-y-auto">
                    <div>
                        {personalAvdelningData?.koppladpersonal?.docs?.length ? (
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {personalAvdelningData.koppladpersonal.docs.map((person) => {
                                    if (typeof person !== 'string') {
                                        return <PersonalItem key={person.id} person={person} />;
                                    }
                                    return null;
                                })}
                            </ul>
                        ) : (
                            <p>Ingen hittades</p>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog >
    );
};

export default ContactDialog;
