import { Typography } from "@/components/typography";
import Link from "next/link";

type AuthorProps = {
    slug:string;
    lastName:string | null;
    firstName:string | null;
}

export default function AuthorCard({slug,lastName, firstName}:AuthorProps) {
    if(lastName == null || firstName == null){
        return null;
    }
    
    const initial = `${firstName[0]}${lastName[0]}`;
    return (
        <div className="bg-background size-48 min-h-0 flex flex-col flex-1 items-center gap-4 p-4">
            <div className="bg-gray-500 rounded-full size-24 border flex flex-col justify-center items-center">
                <Typography as="span" className="uppercase text-4xl">{initial}</Typography>
            </div>
            <div className="flex flex-col capitalize">
                <Link href={`./authors/${slug}`}>
                    <strong>{firstName} {lastName}</strong>
                </Link>
            </div>
        </div>
    )
}