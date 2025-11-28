import MaxWidthWrapper from '@/app/components/MaxWidthWrapper';
import { Button } from '@/app/components/ui/Button';
import Link from 'next/link';


export default function NotFound() {
    return (
        <div className="w-full py-36 min-h-screen text-center flex items-center text-white">
            <MaxWidthWrapper>
                <h1 className="text-3xl font-bold mb-4">Oops! Sidan du sökte hittas inte. Antingen har den flyttats eller tagits bort.</h1>
                <Link href="/" passHref>
                    <Button asChild variant="default">Startsidan</Button>
                </Link>
            </MaxWidthWrapper>
        </div>
    );
}