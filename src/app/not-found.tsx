import MaxWidthWrapper from '@/app/components/MaxWidthWrapper';
import { Button } from '@/app/components/ui/Button';
import Link from 'next/link';


export default function NotFound() {
    return (
        <div className="w-full py-36 min-h-screen text-center flex items-center bg-white text-black">
            <MaxWidthWrapper>
                <p className="text-base mb-4">Sidan du sökte hittas inte. Den kan ha flyttats eller tagits bort.</p>
                <Link href="/" passHref>
                    <Button asChild variant="default">Startsidan</Button>
                </Link>
            </MaxWidthWrapper>
        </div>
    );
}